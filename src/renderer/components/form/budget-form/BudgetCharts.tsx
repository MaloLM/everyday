import { useMemo } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { BudgetExpense, BudgetIncome, computeNetIncome, computeTotalExpenses } from '../../../utils'
import { COLORS, TAG_COLORS } from '../../../utils/constants'

ChartJS.register(ArcElement, Tooltip, Legend)

interface BudgetChartsProps {
    incomes: BudgetIncome[]
    expenses: BudgetExpense[]
    currencySymbol: string
}

const chartOptions = (rawAmounts: number[], currencySymbol: string) => ({
    plugins: {
        legend: { display: false },
        tooltip: {
            callbacks: {
                label: (context: any) => {
                    const amount = rawAmounts[context.dataIndex]
                    const formatted = amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                    return ` ${context.parsed}% — ${formatted} ${currencySymbol}`
                },
            },
        },
    },
})

export const BudgetCharts = ({ incomes, expenses, currencySymbol }: BudgetChartsProps) => {
    const netIncome = useMemo(() => computeNetIncome(incomes), [incomes])
    const totalExpenses = useMemo(() => computeTotalExpenses(expenses), [expenses])

    const { balanceData, balanceRawAmounts } = useMemo(() => {
        if (netIncome === 0 && totalExpenses === 0) {
            return {
                balanceData: {
                    labels: ['No data'],
                    datasets: [{
                        data: [1],
                        backgroundColor: [COLORS.lightNobleBlack],
                        borderColor: COLORS.lightNobleBlack,
                        borderWidth: 2,
                    }],
                },
                balanceRawAmounts: [0],
            }
        }

        if (totalExpenses >= netIncome) {
            const covered = netIncome
            const deficit = totalExpenses - netIncome
            const total = covered + deficit
            const toPercent = (v: number) => Math.round((v / total) * 1000) / 10
            return {
                balanceData: {
                    labels: deficit > 0 ? ['Covered by income', 'Deficit'] : ['Expenses'],
                    datasets: [{
                        data: deficit > 0 ? [toPercent(covered), toPercent(deficit)] : [100],
                        backgroundColor: deficit > 0
                            ? [COLORS.nobleGold, COLORS.error]
                            : [COLORS.nobleGold],
                        borderColor: COLORS.lightNobleBlack,
                        borderWidth: 2,
                    }],
                },
                balanceRawAmounts: deficit > 0 ? [covered, deficit] : [covered],
            }
        }

        const remaining = netIncome - totalExpenses
        const total = totalExpenses + remaining
        const toPercent = (v: number) => Math.round((v / total) * 1000) / 10
        return {
            balanceData: {
                labels: ['Expenses', 'Remaining'],
                datasets: [{
                    data: [toPercent(totalExpenses), toPercent(remaining)],
                    backgroundColor: [COLORS.nobleGold, COLORS.secondaryGold],
                    borderColor: COLORS.lightNobleBlack,
                    borderWidth: 2,
                }],
            },
            balanceRawAmounts: [totalExpenses, remaining],
        }
    }, [netIncome, totalExpenses])

    const { incomeByTagData, incomeRawAmounts } = useMemo(() => {
        const groups = new Map<string, number>()
        for (const income of incomes) {
            const tag = income.tag || 'Untagged'
            const net = income.value * (1 - (income.deductionRate) / 100)
            groups.set(tag, (groups.get(tag) || 0) + net)
        }
        const entries = [...groups.entries()].sort((a, b) => b[1] - a[1])
        const labels = entries.map(([k]) => k)
        const rawValues = entries.map(([, v]) => v)
        const total = rawValues.reduce((s, v) => s + v, 0)
        const data = rawValues.map((v) => Math.round((v / total) * 1000) / 10)
        return {
            incomeByTagData: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: labels.map((_, i) => TAG_COLORS[i % TAG_COLORS.length]),
                    borderColor: COLORS.lightNobleBlack,
                    borderWidth: 2,
                }],
            },
            incomeRawAmounts: rawValues.map((v) => Math.round(v * 100) / 100),
        }
    }, [incomes])

    const { expenseByTagData, expenseRawAmounts } = useMemo(() => {
        const groups = new Map<string, number>()
        for (const expense of expenses) {
            const tag = expense.tag || 'Untagged'
            groups.set(tag, (groups.get(tag) || 0) + expense.value)
        }
        const entries = [...groups.entries()].sort((a, b) => b[1] - a[1])
        const labels = entries.map(([k]) => k)
        const rawValues = entries.map(([, v]) => v)
        const total = rawValues.reduce((s, v) => s + v, 0)
        const data = rawValues.map((v) => Math.round((v / total) * 1000) / 10)
        return {
            expenseByTagData: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: labels.map((_, i) => TAG_COLORS[i % TAG_COLORS.length]),
                    borderColor: COLORS.lightNobleBlack,
                    borderWidth: 2,
                }],
            },
            expenseRawAmounts: rawValues.map((v) => Math.round(v * 100) / 100),
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
                    <div className="fin-chart h-full w-full">
                        <Doughnut data={balanceData} options={chartOptions(balanceRawAmounts, currencySymbol)} />
                    </div>
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
                        <Doughnut data={incomeByTagData} options={chartOptions(incomeRawAmounts, currencySymbol)} />
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
                        <Doughnut data={expenseByTagData} options={chartOptions(expenseRawAmounts, currencySymbol)} />
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
