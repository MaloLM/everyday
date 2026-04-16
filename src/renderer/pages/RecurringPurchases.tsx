import { useState, useEffect } from 'react'
import { ipc } from '../api/electron'
import { Loading } from '../components/utils/Loading'
import { RpForm } from '../components/form/rp-form/RpForm'
import { useAppContext } from '../context'

export const RecurringPurchases = () => {
    const { rpData, refreshRpData } = useAppContext()
    const { saveRpItem, deleteRpItem } = ipc
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        refreshRpData().then(() => setIsLoaded(true))
    }, [])

    return (
        <div className="flex h-full flex-col">
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
