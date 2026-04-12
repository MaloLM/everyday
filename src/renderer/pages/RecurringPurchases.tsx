import { useState, useEffect } from 'react'
import { useIpcRenderer } from '../api/electron'
import { Loading } from '../components'
import { RpForm } from '../components/form/rp-form/RpForm'
import { useAppContext } from '../context'

export const RecurringPurchases = () => {
    const { rpData, refreshRpData } = useAppContext()
    const { saveRpItem, deleteRpItem } = useIpcRenderer()
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        refreshRpData().then(() => setIsLoaded(true))
    }, [])

    return (
        <div className="flex h-full flex-col">
            <h1 className="mb-5 font-serif text-4xl font-medium tracking-wider">Recurring Purchases</h1>
            {!isLoaded ? (
                <Loading />
            ) : (
                <RpForm
                    rpData={rpData}
                    onSave={async (items) => {
                        for (const item of items) {
                            await saveRpItem(item)
                        }
                        for (const existing of rpData.items) {
                            if (!items.find((i) => i.id === existing.id)) {
                                await deleteRpItem(existing.id)
                            }
                        }
                        await refreshRpData()
                    }}
                />
            )}
        </div>
    )
}
