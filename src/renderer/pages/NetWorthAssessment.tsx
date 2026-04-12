import { useState, useEffect } from 'react'
import { useIpcRenderer } from '../api/electron'
import { Loading } from '../components'
import { NwForm } from '../components/form/nw-form/NwForm'
import { useAppContext } from '../context'
import { NetWorthEntry } from '../utils'
import toast from 'react-hot-toast'

export const NetWorthAssessment = () => {
    const { nwData, refreshNwData } = useAppContext()
    const { saveNetWorthEntry, deleteNetWorthEntry } = useIpcRenderer()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (nwData) {
            setIsLoading(false)
        }
    }, [nwData])

    const handleSaveEntry = async (entry: NetWorthEntry) => {
        try {
            await saveNetWorthEntry(entry)
            await refreshNwData()
        } catch {
            toast.error('Failed to save entry')
        }
    }

    const handleDeleteEntry = async (entryId: string) => {
        try {
            await deleteNetWorthEntry(entryId)
            await refreshNwData()
        } catch {
            toast.error('Failed to delete entry')
        }
    }

    return (
        <div className="flex h-full flex-col">
            <h1 className="mb-5 font-serif text-4xl font-medium tracking-wider">Net Worth Assessment</h1>
            {isLoading ? (
                <Loading />
            ) : (
                <NwForm nwData={nwData} onSaveEntry={handleSaveEntry} onDeleteEntry={handleDeleteEntry} />
            )}
        </div>
    )
}
