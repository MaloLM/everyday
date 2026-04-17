import { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react'
import { ipc } from '../api/electron'
import toast from 'react-hot-toast'
import { TamFormData, NetWorthData, RecurringPurchasesData, RecipesData, BudgetData, SavingsProjectsData, ExpenseAnalysisData, GiftIdeasData, parseTamFormData, parseNetWorthData, parseRpData, parseRecipesData, parseBudgetData, parseSavingsProjectsData, parseEaData, parseGiftIdeasData, INIT_NW_DATA, INIT_RP_DATA, INIT_RECIPES_DATA, INIT_BUDGET_DATA, INIT_SP_DATA, INIT_EA_DATA, INIT_GIFT_IDEAS_DATA } from '../utils'

interface AppContextState {
    tamData: TamFormData
    setTamData: (data: TamFormData) => void
    nwData: NetWorthData
    setNwData: (data: NetWorthData) => void
    refreshNwData: () => Promise<void>
    rpData: RecurringPurchasesData
    setRpData: (data: RecurringPurchasesData) => void
    refreshRpData: () => Promise<void>
    recipesData: RecipesData
    setRecipesData: (data: RecipesData) => void
    refreshRecipesData: () => Promise<void>
    budgetData: BudgetData
    setBudgetData: (data: BudgetData) => void
    refreshBudgetData: () => Promise<void>
    spData: SavingsProjectsData
    setSpData: (data: SavingsProjectsData) => void
    refreshSpData: () => Promise<void>
    eaData: ExpenseAnalysisData
    setEaData: (data: ExpenseAnalysisData) => void
    refreshEaData: () => Promise<void>
    giftIdeasData: GiftIdeasData
    setGiftIdeasData: (data: GiftIdeasData) => void
    refreshGiftIdeasData: () => Promise<void>
    blurFinances: boolean
    toggleBlurFinances: () => void
    sidebarOrder: string[]
    setSidebarOrder: (order: string[]) => void
}

const AppContext = createContext<AppContextState>({
    tamData: {} as TamFormData,
    setTamData: () => {},
    nwData: INIT_NW_DATA,
    setNwData: () => {},
    refreshNwData: async () => {},
    rpData: INIT_RP_DATA,
    setRpData: () => {},
    refreshRpData: async () => {},
    recipesData: INIT_RECIPES_DATA,
    setRecipesData: () => {},
    refreshRecipesData: async () => {},
    budgetData: INIT_BUDGET_DATA,
    setBudgetData: () => {},
    refreshBudgetData: async () => {},
    spData: INIT_SP_DATA,
    setSpData: () => {},
    refreshSpData: async () => {},
    eaData: INIT_EA_DATA,
    setEaData: () => {},
    refreshEaData: async () => {},
    giftIdeasData: INIT_GIFT_IDEAS_DATA,
    setGiftIdeasData: () => {},
    refreshGiftIdeasData: async () => {},
    blurFinances: false,
    toggleBlurFinances: () => {},
    sidebarOrder: ['/', '/tam', '/nw', '/rp', '/recipes', '/budget', '/sp', '/ea', '/gift-ideas'],
    setSidebarOrder: () => {},
})

function useRefresh<T>(
    loader: () => Promise<any>,
    parser: (d: any) => T,
    setter: (d: T) => void,
    label: string,
) {
    return useCallback(async () => {
        try {
            setter(parser(await loader()))
        } catch (err) {
            console.error(`Failed to load ${label}:`, err)
            toast.error(`Failed to load ${label}`)
        }
    }, [])
}

export const AppProvider = ({ children }) => {
    const [tamData, setTamData] = useState<TamFormData>({} as TamFormData)
    const [nwData, setNwData] = useState<NetWorthData>(INIT_NW_DATA)
    const [rpData, setRpData] = useState<RecurringPurchasesData>(INIT_RP_DATA)
    const [recipesData, setRecipesData] = useState<RecipesData>(INIT_RECIPES_DATA)
    const [budgetData, setBudgetData] = useState<BudgetData>(INIT_BUDGET_DATA)
    const [spData, setSpData] = useState<SavingsProjectsData>(INIT_SP_DATA)
    const [eaData, setEaData] = useState<ExpenseAnalysisData>(INIT_EA_DATA)
    const [giftIdeasData, setGiftIdeasData] = useState<GiftIdeasData>(INIT_GIFT_IDEAS_DATA)
    const [blurFinances, setBlurFinances] = useState<boolean>(() => localStorage.getItem('blurFinances') === 'true')
    const defaultOrder = ['/', '/tam', '/nw', '/rp', '/recipes', '/budget', '/sp', '/ea', '/gift-ideas']
    const [sidebarOrder, setSidebarOrderState] = useState<string[]>(() => {
        const stored = localStorage.getItem('sidebarOrder')
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                const defaultSet = new Set(defaultOrder)
                const storedSet = new Set(parsed)
                if (parsed.length === defaultOrder.length && defaultOrder.every((p) => storedSet.has(p)) && parsed.every((p: string) => defaultSet.has(p))) {
                    return parsed
                }
            } catch { /* fall through */ }
        }
        return defaultOrder
    })

    const setSidebarOrder = useCallback((order: string[]) => {
        setSidebarOrderState(order)
        localStorage.setItem('sidebarOrder', JSON.stringify(order))
    }, [])

    const toggleBlurFinances = useCallback(() => {
        setBlurFinances((prev) => {
            const next = !prev
            localStorage.setItem('blurFinances', String(next))
            return next
        })
    }, [])

    const refreshNwData = useRefresh(ipc.loadNetWorthData, parseNetWorthData, setNwData, 'net worth data')
    const refreshRpData = useRefresh(ipc.loadRpData, parseRpData, setRpData, 'recurring purchases data')
    const refreshRecipesData = useRefresh(ipc.loadRecipesData, parseRecipesData, setRecipesData, 'recipes data')
    const refreshBudgetData = useRefresh(ipc.loadBudgetData, parseBudgetData, setBudgetData, 'budget data')
    const refreshSpData = useRefresh(ipc.loadSavingsProjectsData, parseSavingsProjectsData, setSpData, 'savings projects data')
    const refreshEaData = useRefresh(ipc.loadEaData, parseEaData, setEaData, 'expense analysis data')
    const refreshGiftIdeasData = useRefresh(ipc.loadGiftIdeasData, parseGiftIdeasData, setGiftIdeasData, 'gift ideas data')

    useEffect(() => {
        const handleResponse = (event, responseData) => {
            if (event.error) {
                console.error(event.error)
                toast.error(event.error)
            } else {
                setTamData(parseTamFormData(responseData))
            }
        }

        const cleanup = ipc.onResponseData(handleResponse)
        ipc.requestData()
        refreshNwData()
        refreshRpData()
        refreshRecipesData()
        refreshBudgetData()
        refreshSpData()
        refreshEaData()
        refreshGiftIdeasData()
        return cleanup
    }, [])

    const contextValue = useMemo(() => ({
        tamData, setTamData,
        nwData, setNwData, refreshNwData,
        rpData, setRpData, refreshRpData,
        recipesData, setRecipesData, refreshRecipesData,
        budgetData, setBudgetData, refreshBudgetData,
        spData, setSpData, refreshSpData,
        eaData, setEaData, refreshEaData,
        giftIdeasData, setGiftIdeasData, refreshGiftIdeasData,
        blurFinances, toggleBlurFinances,
        sidebarOrder, setSidebarOrder,
    }), [
        tamData, nwData, rpData, recipesData, budgetData, spData, eaData, giftIdeasData,
        blurFinances, sidebarOrder,
        refreshNwData, refreshRpData, refreshRecipesData, refreshBudgetData, refreshSpData, refreshEaData, refreshGiftIdeasData,
        toggleBlurFinances, setSidebarOrder,
    ])

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext)
