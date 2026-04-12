import { createContext, useState, useContext, useEffect, useCallback } from 'react'
import { useIpcRenderer } from '../api/electron'
import toast from 'react-hot-toast'
import { TamFormData, NetWorthData, RecurringPurchasesData, RecipesData, parseTamFormData, parseNetWorthData, parseRpData, parseRecipesData, INIT_NW_DATA, INIT_RP_DATA, INIT_RECIPES_DATA } from '../utils'

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
})

export const AppProvider = ({ children }) => {
    const [tamData, setTamData] = useState<TamFormData>({} as TamFormData)
    const [nwData, setNwData] = useState<NetWorthData>(INIT_NW_DATA)
    const [rpData, setRpData] = useState<RecurringPurchasesData>(INIT_RP_DATA)
    const [recipesData, setRecipesData] = useState<RecipesData>(INIT_RECIPES_DATA)
    const { sendRequestData, onResponseData, loadNetWorthData, loadRpData, loadRecipesData } = useIpcRenderer()

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
    }

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext)
