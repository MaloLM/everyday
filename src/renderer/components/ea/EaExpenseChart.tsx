import { useMemo } from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { EaTransaction } from '../../utils/types'
import { COLORS, TAG_COLORS } from '../../utils/constants'

ChartJS.register(ArcElement, Tooltip, Legend)

interface EaExpenseChartProps {
    transactions: EaTransaction[]
    currencySymbol: string
}

export const EaExpenseChart = ({ transactions, currencySymbol }: EaExpenseChartProps) => {
    const { chartData, rawAmounts } = useMemo(() => {
        const groups = new Map<string, number>()
        for (const t of transactions) {
            const tag = t.tag || 'Untagged'
            groups.set(tag, (groups.get(tag) || 0) + Math.abs(t.amount))
        }
        if (groups.size === 0) {
            return {
                chartData: {
                    labels: ['No data'],
                    datasets: [{
                        data: [1],
                        backgroundColor: [COLORS.lightNobleBlack],
                        borderColor: COLORS.lightNobleBlack,
                        borderWidth: 2,
                    }],
                },
                rawAmounts: [0],
            }
        }
        const entries = [...groups.entries()]
            .sort((a, b) => b[1] - a[1])
        const labels = entries.map(([k]) => k)
        const rawValues = entries.map(([, v]) => v)
        const total = rawValues.reduce((s, v) => s + v, 0)
        const data = rawValues.map((v) => Math.round((v / total) * 1000) / 10)
        return {
            chartData: {
                labels,
                datasets: [{
                    data,
                    backgroundColor: labels.map((_, i) => TAG_COLORS[i % TAG_COLORS.length]),
                    borderColor: COLORS.lightNobleBlack,
                    borderWidth: 2,
                }],
            },
            rawAmounts: rawValues.map((v) => Math.round(v * 100) / 100),
        }
    }, [transactions])

    const total = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)

    return (
        <div className="flex flex-col items-center gap-2">
            <h3 className="text-sm font-medium text-softWhite/70">Expenses by Tag</h3>
            <div className="flex items-center gap-6">
                <div className="relative flex h-44 w-44 shrink-0 items-center justify-center">
                    <div className="fin-chart h-full w-full">
                        <Doughnut
                            data={chartData}
                            options={{
                                plugins: {
                                    legend: { display: false },
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => {
                                                const amount = rawAmounts[context.dataIndex]
                                                const formatted = amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                                return ` ${context.parsed}% — ${formatted} ${currencySymbol}`
                                            },
                                        },
                                    },
                                },
                            }}
                        />
                    </div>
                    <span className="fin-value absolute text-sm font-bold text-nobleGold">
                        {total.toLocaleString(undefined, total % 1 !== 0
                            ? { minimumFractionDigits: 1, maximumFractionDigits: 1 }
                            : { maximumFractionDigits: 0 })} {currencySymbol}
                    </span>
                </div>
                <div className="flex flex-col gap-1.5">
                    {chartData.labels.map((label, i) => (
                        <div key={label} className="flex items-center gap-2 text-xs text-softWhite/60">
                            <span
                                className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                                style={{ backgroundColor: TAG_COLORS[i % TAG_COLORS.length] }}
                            />
                            {label}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
