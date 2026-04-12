import { useRef } from 'react'
import { LineChart } from '../../LineChart'
import { NetWorthEntry, CURRENCIES, COLORS, computeNetWorth } from '../../../utils'
import { Button } from '../../Button'
import { Download } from 'lucide-react'
import toast from 'react-hot-toast'

interface NwLineChartProps {
    entries: NetWorthEntry[]
    currency: string
}

export const NwLineChart = ({ entries, currency }: NwLineChartProps) => {
    const chartRef = useRef<any>(null)
    const currencySymbol = CURRENCIES.get(currency) || currency

    const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))
    const labels = sorted.map((e) => e.date)
    const totals = sorted.map((e) => computeNetWorth(e))

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Net Worth',
                data: totals,
                borderColor: COLORS.nobleGold,
                backgroundColor: COLORS.nobleGold + '20',
                fill: true,
                tension: 0.3,
                pointBackgroundColor: COLORS.nobleGold,
                pointBorderColor: COLORS.nobleGold,
            },
        ],
    }

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
            <div className="h-64 w-full">
                <LineChart
                    ref={chartRef}
                    chartData={chartData}
                    title="Net Worth Evolution"
                    label={(context) => `Net Worth: ${context.raw.toLocaleString()} ${currencySymbol}`}
                />
            </div>
        </div>
    )
}
