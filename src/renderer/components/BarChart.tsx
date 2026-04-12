import { Bar } from 'react-chartjs-2'
import { COLORS, ChartData } from '../utils'
import { Chart, registerables } from 'chart.js'

Chart.register(...registerables)

interface TamBarChartProps {
    chartData: ChartData
    className?: string
    label: (context: any) => string
    title: string
}

export const BarChart = ({ chartData, className, label, title }: TamBarChartProps) => {
    return (
        <Bar
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
                            color: COLORS.softWhite, // Color for legends
                        },
                    },
                },
                scales: {
                    x: {
                        stacked: true,
                        grid: {
                            color: COLORS.lightGray, // Color for x-axis lines
                        },
                        ticks: {
                            color: COLORS.softWhite, // Color for y-axis legends
                        },
                    },
                    y: {
                        stacked: true,
                        grid: {
                            color: COLORS.lightGray, // Color for x-axis lines
                        },
                        ticks: {
                            color: COLORS.softWhite, // Color for y-axis legends
                        },
                    },
                },
            }}
        />
    )
}
