import { useMemo } from 'react'
import { DonutChart } from '../DonutChart'
import { EaTransaction } from '../../utils/types'
import { COLORS, TAG_COLORS } from '../../utils/constants'

interface EaExpenseChartProps {
    transactions: EaTransaction[]
    currencySymbol: string
}

export const EaExpenseChart = ({ transactions, currencySymbol }: EaExpenseChartProps) => {
    const chartData = useMemo(() => {
        const groups = new Map<string, number>()
        for (const t of transactions) {
            const tag = t.tag || 'Untagged'
            groups.set(tag, (groups.get(tag) || 0) + Math.abs(t.amount))
        }
        if (groups.size === 0) {
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
    }, [transactions])

    const total = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)

    return (
        <div className="flex flex-col items-center gap-2">
            <h3 className="text-sm font-medium text-softWhite/70">Expenses by Tag</h3>
            <div className="relative flex h-44 w-44 items-center justify-center">
                <div className="fin-chart h-full w-full"><DonutChart data={chartData} /></div>
                <span className="fin-value absolute text-sm font-bold text-nobleGold">
                    {total.toLocaleString(undefined, total % 1 !== 0
                        ? { minimumFractionDigits: 1, maximumFractionDigits: 1 }
                        : { maximumFractionDigits: 0 })} {currencySymbol}
                </span>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
                {chartData.labels.map((label, i) => (
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
    )
}
