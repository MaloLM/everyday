import { createContext, useState, useContext, useEffect, useCallback } from 'react'
import { useIpcRenderer } from '../api/electron'
import toast from 'react-hot-toast'
import { TamFormData, NetWorthData, RecurringPurchasesData, RecipesData, BudgetData, parseTamFormData, parseNetWorthData, parseRpData, parseRecipesData, parseBudgetData, INIT_NW_DATA, INIT_RP_DATA, INIT_RECIPES_DATA, INIT_BUDGET_DATA } from '../utils'

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
    blurFinances: false,
    toggleBlurFinances: () => {},
    sidebarOrder: ['/', '/tam', '/nw', '/rp', '/recipes', '/budget'],
    setSidebarOrder: () => {},
})

export const AppProvider = ({ children }) => {
    const [tamData, setTamData] = useState<TamFormData>({} as TamFormData)
    const [nwData, setNwData] = useState<NetWorthData>(INIT_NW_DATA)
    const [rpData, setRpData] = useState<RecurringPurchasesData>(INIT_RP_DATA)
    const [recipesData, setRecipesData] = useState<RecipesData>(INIT_RECIPES_DATA)
    const [budgetData, setBudgetData] = useState<BudgetData>(INIT_BUDGET_DATA)
    const [blurFinances, setBlurFinances] = useState<boolean>(() => localStorage.getItem('blurFinances') === 'true')
    const defaultOrder = ['/', '/tam', '/nw', '/rp', '/recipes', '/budget']
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
    const { sendRequestData, onResponseData, loadNetWorthData, loadRpData, loadRecipesData, loadBudgetData } = useIpcRenderer()

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

    const refreshNwData = useCallback(async () => {
        try {
            const data = await loadNetWorthData()
            setNwData(parseNetWorthData(data))
        } catch (err) {
            console.error('Failed to load net worth data:', err)
            toast.error('Failed to load net worth data')
        }
    }, [])

    const refreshRpData = useCallback(async () => {
        try {
            const data = await loadRpData()
            setRpData(parseRpData(data))
        } catch (err) {
            console.error('Failed to load recurring purchases data:', err)
            toast.error('Failed to load recurring purchases data')
        }
    }, [])

    const refreshRecipesData = useCallback(async () => {
        try {
            const data = await loadRecipesData()
            setRecipesData(parseRecipesData(data))
        } catch (err) {
            console.error('Failed to load recipes data:', err)
            toast.error('Failed to load recipes data')
        }
    }, [])

    const refreshBudgetData = useCallback(async () => {
        try {
            const data = await loadBudgetData()
            setBudgetData(parseBudgetData(data))
        } catch (err) {
            console.error('Failed to load budget data:', err)
            toast.error('Failed to load budget data')
        }
    }, [])

    useEffect(() => {
        const handleResponse = (event, responseData) => {
            if (event.error) {
                console.error(event.error)
                toast.error(event.error)
            } else {
                setTamData(parseTamFormData(responseData))
            }
        }

        const cleanup = onResponseData(handleResponse)
        sendRequestData()
        refreshNwData()
        refreshRpData()
        refreshRecipesData()
        refreshBudgetData()
        return cleanup
    }, [])

    const contextValue = {
        tamData,
        setTamData,
        nwData,
        setNwData,
        refreshNwData,
        rpData,
        setRpData,
        refreshRpData,
        recipesData,
        setRecipesData,
        refreshRecipesData,
        budgetData,
        setBudgetData,
        refreshBudgetData,
        blurFinances,
        toggleBlurFinances,
        sidebarOrder,
        setSidebarOrder,
    }

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext)
