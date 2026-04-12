import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
ChartJS.register(ArcElement, Tooltip, Legend)

interface DonutChartProps {
    data: any
    className?: string
}

export const DonutChart = ({ data, className }: DonutChartProps) => {
    return (
        <Doughnut
            className={className}
            data={data}
            options={{
                plugins: {
                    legend: {
                        position: 'bottom' as const,
                        display: false,
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return ` ${context.raw}%`
                            },
                        },
                    },
                },
            }}
        />
    )
}
