import React, { createContext, useState, useContext, useEffect } from 'react'
import { useIpcRenderer } from '../api/electron'
import toast from 'react-hot-toast'
import { TamFormData, parseTamFormData } from '../utils'

interface AppContextState {
    tamData: TamFormData
    setTamData: (data: TamFormData) => void
}

const AppContext = createContext<AppContextState>({
    tamData: {} as TamFormData,
    setTamData: () => {},
})

export const AppProvider = ({ children }) => {
    const [tamData, setTamData] = useState<TamFormData>({} as TamFormData)
    const { sendRequestData, onResponseData } = useIpcRenderer()

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
        return cleanup
    }, [])

    const contextValue = {
        tamData,
        setTamData,
    }

    return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

export const useAppContext = () => useContext(AppContext)
