import { useState, useEffect } from 'react'
import { useIpcRenderer } from '../api/electron'
import { Loading } from '../components/utils/Loading'
import { BudgetForm } from '../components/form/budget-form/BudgetForm'
import { useAppContext } from '../context'

export const Budgeting = () => {
    const { budgetData, refreshBudgetData } = useAppContext()
    const { saveBudgetData } = useIpcRenderer()
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        refreshBudgetData().then(() => setIsLoaded(true))
    }, [])

    return (
        <div className="flex h-full flex-col">
            <h1 className="mb-5 font-serif text-4xl font-medium tracking-wider">Budgeting</h1>
            {!isLoaded ? (
                <Loading />
            ) : (
                <BudgetForm
                    budgetData={budgetData}
                    onSave={async (data) => {
                        await saveBudgetData(data)
                        await refreshBudgetData()
                    }}
                />
            )}
        </div>
    )
}
