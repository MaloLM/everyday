import { forwardRef } from 'react'
import { Line } from 'react-chartjs-2'
import { COLORS } from '../utils'
import { Chart, registerables } from 'chart.js'
import 'chartjs-adapter-date-fns'

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
                        type: 'time',
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
