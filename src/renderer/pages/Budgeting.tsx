import { useState, useEffect } from 'react'
import { ipc } from '../api/electron'
import { Loading } from '../components/utils/Loading'
import { BudgetForm } from '../components/form/budget-form/BudgetForm'
import { useAppContext } from '../context'

export const Budgeting = () => {
    const { budgetData, refreshBudgetData } = useAppContext()
    const { saveBudgetData } = ipc
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        refreshBudgetData().then(() => setIsLoaded(true))
    }, [])

    return (
        <div className="flex h-full flex-col">
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
