import { forwardRef } from 'react'
import { Line } from 'react-chartjs-2'
import { COLORS } from '../utils'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

interface LineChartProps {
    chartData: any
    className?: string
    label: (context: any) => string
    title: string
}

export const LineChart = forwardRef<any, LineChartProps>(({ chartData, className, label, title }, ref) => {
    return (
        <Line
            ref={ref as any}
            className={className}
            data={chartData}
            options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: false,
                        text: title,
                    },
                    tooltip: {
                        callbacks: {
                            label: label,
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
                        grid: {
                            color: COLORS.lightGray,
                        },
                        ticks: {
                            color: COLORS.softWhite,
                        },
                    },
                    y: {
                        grid: {
                            color: COLORS.lightGray,
                        },
                        ticks: {
                            color: COLORS.softWhite,
                        },
                    },
                },
                elements: {
                    point: {
                        backgroundColor: COLORS.nobleGold,
                        borderColor: COLORS.nobleGold,
                        radius: 5,
                        hoverRadius: 7,
                    },
                    line: {
                        borderColor: COLORS.nobleGold,
                        backgroundColor: COLORS.nobleGold + '20',
                        fill: true,
                        tension: 0.3,
                    },
                },
            }}
        />
    )
})
