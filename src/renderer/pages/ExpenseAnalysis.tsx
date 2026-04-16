import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useIpcRenderer } from '../api/electron'
import { Loading } from '../components/utils/Loading'
import { useAppContext } from '../context'
import { EaImportList } from '../components/ea/EaImportList'
import { EaImportDetail } from '../components/ea/EaImportDetail'

export const ExpenseAnalysis = () => {
    const { importId } = useParams<{ importId?: string }>()
    const { eaData, refreshEaData } = useAppContext()
    const { saveEaImport, deleteEaImport } = useIpcRenderer()
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        refreshEaData().then(() => setIsLoaded(true))
    }, [])

    if (!isLoaded) {
        return (
            <div className="flex h-full flex-col">
                <Loading />
            </div>
        )
    }

    if (importId) {
        const importData = eaData.imports.find((imp) => imp.id === importId)
        if (!importData) {
            return (
                <div className="flex h-full flex-col items-center justify-center">
                    <p className="text-softWhite/50">Import not found</p>
                </div>
            )
        }
        return (
            <div className="flex h-full flex-col">
                <EaImportDetail
                    importData={importData}
                    onSave={async (updated) => {
                        await saveEaImport(updated)
                        await refreshEaData()
                    }}
                    onDelete={async (id) => {
                        await deleteEaImport(id)
                        await refreshEaData()
                    }}
                />
            </div>
        )
    }

    return (
        <div className="flex h-full flex-col">
            <EaImportList
                imports={eaData.imports}
                onSaveImport={async (data) => {
                    await saveEaImport(data)
                }}
                onRefresh={refreshEaData}
            />
        </div>
    )
}
