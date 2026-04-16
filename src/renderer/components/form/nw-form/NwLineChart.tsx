import { useRef, useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import { Chart, registerables } from 'chart.js'
import 'chartjs-adapter-date-fns'
import { NetWorthEntry, CURRENCIES, COLORS } from '../../../utils'
import { Button } from '../../Button'
import { Download } from 'lucide-react'
import toast from 'react-hot-toast'

Chart.register(...registerables)

const AREA_PALETTE = [
    '#d4b85b',
    '#5b8fd4',
    '#5bd49a',
    '#d49a5b',
    '#9a5bd4',
    '#d45b5b',
    '#5bd4d4',
    '#d45bb8',
    '#8fd45b',
    '#5b5bd4',
]

interface NwLineChartProps {
    entries: NetWorthEntry[]
    currency: string
}

export const NwLineChart = ({ entries, currency }: NwLineChartProps) => {
    const chartRef = useRef<any>(null)
    const currencySymbol = CURRENCIES.get(currency) || currency

    const chartData = useMemo(() => {
        const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))

        // Collect unique item names in order of first appearance (Set for O(1) lookup)
        const seen = new Set<string>()
        const itemNames: string[] = []
        for (const entry of sorted) {
            for (const item of entry.items) {
                if (!seen.has(item.name)) {
                    seen.add(item.name)
                    itemNames.push(item.name)
                }
            }
        }

        const datasets = itemNames.map((name, i) => {
            const color = AREA_PALETTE[i % AREA_PALETTE.length]
            return {
                label: name,
                data: sorted.map((entry) => {
                    const item = entry.items.find((it) => it.name === name)
                    return { x: entry.date, y: item ? item.estimatedValue : null }
                }),
                spanGaps: false,
                borderColor: color,
                backgroundColor: color + '80',
                fill: true,
                tension: 0.3,
                pointRadius: 3,
                pointHoverRadius: 5,
                pointBackgroundColor: color,
                pointBorderColor: color,
            }
        })

        return { datasets }
    }, [entries])

    const chartOptions = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const val = (context.raw as { y: number }).y
                        return `  ${context.dataset.label}: ${val.toLocaleString()} ${currencySymbol}`
                    },
                    footer: (tooltipItems) => {
                        const total = tooltipItems.reduce(
                            (sum, item) => sum + ((item.raw as { y: number }).y || 0),
                            0,
                        )
                        return `Net Worth: ${total.toLocaleString()} ${currencySymbol}`
                    },
                },
            },
            legend: {
                labels: {
                    color: COLORS.softWhite,
                },
            },
        },
        scales: {
            x: {
                type: 'time' as const,
                stacked: true,
                time: {
                    tooltipFormat: 'dd MMM yyyy',
                    displayFormats: {
                        day: 'dd MMM',
                        week: 'dd MMM',
                        month: 'MMM yyyy',
                        quarter: 'MMM yyyy',
                        year: 'yyyy',
                    },
                },
                ticks: {
                    color: COLORS.softWhite,
                    autoSkip: true,
                    maxRotation: 45,
                },
                grid: {
                    color: COLORS.lightGray,
                },
            },
            y: {
                stacked: true,
                grid: {
                    color: COLORS.lightGray,
                },
                ticks: {
                    color: COLORS.softWhite,
                },
            },
        },
    }), [currencySymbol])

    const exportChart = () => {
        if (!chartRef.current) return
        try {
            const url = chartRef.current.toBase64Image('image/png', 1)
            const link = document.createElement('a')
            link.href = url
            link.download = 'net-worth-chart.png'
            link.click()
            toast.success('Chart exported')
        } catch {
            toast.error('Failed to export chart')
        }
    }

    if (entries.length < 2) {
        return (
            <div className="flex h-48 items-center justify-center">
                <p className="text-softWhite opacity-50">Add at least two audit entries to see the evolution chart</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex justify-end">
                <Button onClick={exportChart} className="flex items-center gap-1 px-3">
                    <Download size={16} />
                    Export
                </Button>
            </div>
            <div className="fin-chart h-64 w-full">
                <Line
                    ref={chartRef}
                    data={chartData}
                    options={chartOptions}
                />
            </div>
        </div>
    )
}
