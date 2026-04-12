import { createContext, useState, useContext, useEffect, useCallback } from 'react'
import { useIpcRenderer } from '../api/electron'
import toast from 'react-hot-toast'
import { TamFormData, NetWorthData, parseTamFormData, parseNetWorthData, INIT_NW_DATA } from '../utils'

interface AppContextState {
    tamData: TamFormData
    setTamData: (data: TamFormData) => void
    nwData: NetWorthData
    setNwData: (data: NetWorthData) => void
    refreshNwData: () => Promise<void>
}

const AppContext = createContext<AppContextState>({
    tamData: {} as TamFormData,
    setTamData: () => {},
    nwData: INIT_NW_DATA,
    setNwData: () => {},
    refreshNwData: async () => {},
})

export const AppProvider = ({ children }) => {
    const [tamData, setTamData] = useState<TamFormData>({} as TamFormData)
    const [nwData, setNwData] = useState<NetWorthData>(INIT_NW_DATA)
    const { sendRequestData, onResponseData, loadNetWorthData } = useIpcRenderer()

    const refreshNwData = useCallback(async () => {
        try {
            const data = await loadNetWorthData()
            setNwData(parseNetWorthData(data))
        } catch (err) {
            console.error('Failed to load net worth data:', err)
            toast.error('Failed to load net worth data')
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
        return cleanup
    }, [])

    const contextValue = {
        tamData,
        setTamData,
        nwData,
        setNwData,
        refreshNwData,
    }

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext)
