import { useState, useEffect } from 'react'
import { ipc } from '../api/electron'
import { Loading } from '../components'
import { NwForm } from '../components/form/nw-form/NwForm'
import { useAppContext } from '../context'
import { NetWorthEntry } from '../utils'
import toast from 'react-hot-toast'

export const NetWorthAssessment = () => {
    const { nwData, refreshNwData } = useAppContext()
    const { saveNetWorthEntry, deleteNetWorthEntry } = ipc
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
            {isLoading ? (
                <Loading />
            ) : (
                <NwForm nwData={nwData} onSaveEntry={handleSaveEntry} onDeleteEntry={handleDeleteEntry} />
            )}
        </div>
    )
}
