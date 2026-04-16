import { useState, useEffect } from 'react'
import { ipc } from '../api/electron'
import { Loading } from '../components/utils/Loading'
import { SpForm } from '../components/form/sp-form/SpForm'
import { useAppContext } from '../context'

export const SavingsProjects = () => {
    const { spData, refreshSpData } = useAppContext()
    const { saveSavingsProjectsData } = ipc
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        refreshSpData().then(() => setIsLoaded(true))
    }, [])

    return (
        <div className="flex h-full flex-col">
            {!isLoaded ? (
                <Loading />
            ) : (
                <SpForm
                    spData={spData}
                    onSave={async (data) => {
                        await saveSavingsProjectsData(data)
                        await refreshSpData()
                    }}
                />
            )}
        </div>
    )
}
