import { useMemo } from 'react'
import { DonutChart } from '../../DonutChart'
import { BudgetExpense, BudgetIncome, computeNetIncome, computeTotalExpenses } from '../../../utils'
import { COLORS, TAG_COLORS } from '../../../utils/constants'

interface BudgetChartsProps {
    incomes: BudgetIncome[]
    expenses: BudgetExpense[]
    currencySymbol: string
}

export const BudgetCharts = ({ incomes, expenses, currencySymbol }: BudgetChartsProps) => {
    const netIncome = useMemo(() => computeNetIncome(incomes), [incomes])
    const totalExpenses = useMemo(() => computeTotalExpenses(expenses), [expenses])

    const balanceData = useMemo(() => {
        if (netIncome === 0 && totalExpenses === 0) {
            return {
                labels: ['No data'],
                datasets: [{
                    data: [1],
                    backgroundColor: [COLORS.lightNobleBlack],
                    borderColor: COLORS.lightNobleBlack,
                    borderWidth: 2,
                }],
            }
        }

        if (totalExpenses >= netIncome) {
            const covered = netIncome
            const deficit = totalExpenses - netIncome
            return {
                labels: deficit > 0 ? ['Covered by income', 'Deficit'] : ['Expenses'],
                datasets: [{
                    data: deficit > 0 ? [covered, deficit] : [covered],
                    backgroundColor: deficit > 0
                        ? [COLORS.nobleGold, COLORS.error]
                        : [COLORS.nobleGold],
                    borderColor: COLORS.lightNobleBlack,
                    borderWidth: 2,
                }],
            }
        }

        const remaining = netIncome - totalExpenses
        return {
            labels: ['Expenses', 'Remaining'],
            datasets: [{
                data: [totalExpenses, remaining],
                backgroundColor: [COLORS.nobleGold, COLORS.secondaryGold],
                borderColor: COLORS.lightNobleBlack,
                borderWidth: 2,
            }],
        }
    }, [netIncome, totalExpenses])

    const incomeByTagData = useMemo(() => {
        const groups = new Map<string, number>()
        for (const income of incomes) {
            const tag = income.tag || 'Untagged'
            const net = income.value * (1 - (income.deductionRate) / 100)
            groups.set(tag, (groups.get(tag) || 0) + net)
        }
        const labels = [...groups.keys()]
        const data = [...groups.values()].map((v) => Math.round(v * 100) / 100)
        return {
            labels,
            datasets: [{
                data,
                backgroundColor: labels.map((_, i) => TAG_COLORS[i % TAG_COLORS.length]),
                borderColor: COLORS.lightNobleBlack,
                borderWidth: 2,
            }],
        }
    }, [incomes])

    const expenseByTagData = useMemo(() => {
        const groups = new Map<string, number>()
        for (const expense of expenses) {
            const tag = expense.tag || 'Untagged'
            groups.set(tag, (groups.get(tag) || 0) + expense.value)
        }
        const labels = [...groups.keys()]
        const data = [...groups.values()].map((v) => Math.round(v * 100) / 100)
        return {
            labels,
            datasets: [{
                data,
                backgroundColor: labels.map((_, i) => TAG_COLORS[i % TAG_COLORS.length]),
                borderColor: COLORS.lightNobleBlack,
                borderWidth: 2,
            }],
        }
    }, [expenses])

    const formatAmount = (v: number) =>
        v.toLocaleString(undefined, v % 1 !== 0
            ? { minimumFractionDigits: 1, maximumFractionDigits: 1 }
            : { maximumFractionDigits: 0 })

    return (
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-evenly">
            <div className="flex flex-col items-center gap-2">
                <h3 className="text-sm font-medium text-softWhite/70">Income vs Expenses</h3>
                <div className="relative flex items-center justify-center w-44 h-44">
                    <div className="fin-chart h-full w-full"><DonutChart data={balanceData} /></div>
                    <span className={`fin-value absolute text-sm font-bold ${totalExpenses > netIncome ? 'text-error' : 'text-nobleGold'}`}>
                        {netIncome === 0 && totalExpenses === 0
                            ? '—'
                            : `${totalExpenses > netIncome ? '-' : '+'}${formatAmount(Math.abs(netIncome - totalExpenses))} ${currencySymbol}`}
                    </span>
                </div>
            </div>

            {incomes.length > 0 && (
                <div className="flex flex-col items-center gap-2">
                    <h3 className="text-sm font-medium text-softWhite/70">Income by Tag</h3>
                    <div className="fin-chart w-44 h-44">
                        <DonutChart data={incomeByTagData} />
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {incomeByTagData.labels.map((label, i) => (
                            <div key={label} className="flex items-center gap-1 text-xs text-softWhite/60">
                                <span
                                    className="inline-block h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: TAG_COLORS[i % TAG_COLORS.length] }}
                                />
                                {label}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {expenses.length > 0 && (
                <div className="flex flex-col items-center gap-2">
                    <h3 className="text-sm font-medium text-softWhite/70">Expenses by Tag</h3>
                    <div className="fin-chart w-44 h-44">
                        <DonutChart data={expenseByTagData} />
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                        {expenseByTagData.labels.map((label, i) => (
                            <div key={label} className="flex items-center gap-1 text-xs text-softWhite/60">
                                <span
                                    className="inline-block h-2.5 w-2.5 rounded-full"
                                    style={{ backgroundColor: TAG_COLORS[i % TAG_COLORS.length] }}
                                />
                                {label}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
