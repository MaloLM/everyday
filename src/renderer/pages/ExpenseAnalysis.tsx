import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'react-router-dom'
import { useIpcRenderer } from '../api/electron'
import { Loading } from '../components/utils/Loading'
import { useAppContext } from '../context'
import { EaImportList } from '../components/ea/EaImportList'
import { EaImportDetail } from '../components/ea/EaImportDetail'
import { ExpenseAnalysisData } from '../utils/types'

export const ExpenseAnalysis = () => {
    const { importId } = useParams<{ importId?: string }>()
    const { eaData, refreshEaData } = useAppContext()
    const { saveEaImport, deleteEaImport, saveEaData } = useIpcRenderer()
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        refreshEaData().then(() => setIsLoaded(true))
    }, [])

    // Union of persisted tags + all tags found across every transaction
    const allKnownTags = useMemo(() => {
        const set = new Set(eaData.tags || [])
        for (const imp of eaData.imports) {
            for (const t of imp.transactions) {
                if (t.tag) set.add(t.tag)
            }
        }
        return [...set].sort()
    }, [eaData])

    // Persist any new tags discovered during a save
    const saveImportAndSyncTags = async (updated: ExpenseAnalysisData['imports'][number]) => {
        await saveEaImport(updated)
        const newTags = new Set(eaData.tags || [])
        for (const t of updated.transactions) {
            if (t.tag) newTags.add(t.tag)
        }
        if (newTags.size !== (eaData.tags || []).length) {
            await saveEaData({ ...eaData, tags: [...newTags] })
        }
        await refreshEaData()
    }

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
                    allKnownTags={allKnownTags}
                    onSave={saveImportAndSyncTags}
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
                allKnownTags={allKnownTags}
                onSaveImport={async (data) => {
                    await saveEaImport(data)
                }}
                onSaveTags={async (tags) => {
                    await saveEaData({ ...eaData, tags })
                    await refreshEaData()
                }}
                onRefresh={refreshEaData}
            />
        </div>
    )
}
