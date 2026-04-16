import { useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip } from 'chart.js'
import { EaImport } from '../../utils/types'
import { COLORS, CURRENCIES } from '../../utils/constants'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip)

interface EaEvolutionChartProps {
    imports: EaImport[]
    currencySymbol: string
}

export const EaEvolutionChart = ({ imports, currencySymbol }: EaEvolutionChartProps) => {
    const { labels, totals } = useMemo(() => {
        // Display order is top-to-bottom = newest-to-oldest, so reverse for chronological left-to-right
        const chronological = [...imports].reverse()
        return {
            labels: chronological.map((imp) => imp.title),
            totals: chronological.map((imp) =>
                imp.transactions.reduce((s, t) => s + Math.abs(t.amount), 0),
            ),
        }
    }, [imports])

    const data = {
        labels,
        datasets: [
            {
                data: totals,
                borderColor: COLORS.nobleGold,
                backgroundColor: COLORS.nobleGold,
                pointBackgroundColor: COLORS.nobleGold,
                tension: 0.3,
                borderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context: any) => {
                        const val = context.parsed.y
                        const formatted = val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        return ` ${formatted} ${currencySymbol}`
                    },
                },
            },
        },
        scales: {
            x: {
                ticks: { color: 'rgba(255,255,255,0.4)', font: { size: 10 } },
                grid: { color: 'rgba(255,255,255,0.05)' },
            },
            y: {
                ticks: {
                    color: 'rgba(255,255,255,0.4)',
                    font: { size: 10 },
                    callback: (value: any) => value.toLocaleString(),
                },
                grid: { color: 'rgba(255,255,255,0.05)' },
            },
        },
    }

    return (
        <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-softWhite/70">Spending Evolution</h3>
            <div className="fin-chart h-48">
                <Line data={data} options={options} />
            </div>
        </div>
    )
}
