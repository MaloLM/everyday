import { Button } from '../../Button'
import { MOCK_CHART_DATA } from '../../../utils'
import { BarChart } from '../../BarChart'

interface TamBarChartProps {
    chartData: any
    computeResult: any
    onCompute: () => void
    errors: any
}

export const TamBarChart = ({ chartData, computeResult, onCompute, errors }: TamBarChartProps) => {
    return (
        <div>
            {computeResult.assets && chartData.datasets ? (
                <div className="mt-12 w-full">
                    <BarChart
                        className="h-full w-full"
                        title="New Target Allocation"
                        label={(context) => {
                            let label = context.dataset.label || ''
                            if (label === 'Next Buy') {
                                label += `: ${context.raw} (Quantity to buy: ${chartData.nbsToBuy[context.dataIndex]})`
                            } else {
                                label += `: ${context.raw}`
                            }
                            return label
                        }}
                        chartData={chartData}
                    />
                </div>
            ) : (
                <div className="relative ">
                    <div className="blur-xl">
                        <BarChart
                            className="h-full w-full"
                            title="New Target Allocation"
                            label={(context) => {
                                let label = context.dataset.label || ''
                                if (label === 'Next Buy') {
                                    label += `: ${context.raw} (Quantity to buy: ${chartData.nbsToBuy[context.dataIndex]})`
                                } else {
                                    label += `: ${context.raw}`
                                }
                                return label
                            }}
                            chartData={MOCK_CHART_DATA}
                        />
                    </div>
                    <div className="absolute top-0 flex h-full w-full items-center justify-center">
                        <Button
                            filled
                            onClick={() => onCompute()}
                            className={` h-20 w-1/4 bg-lightNobleBlack text-2xl ${errors.assets ? 'bg-error' : ''} `}
                            type="submit"
                        >
                            Compute
                        </Button>
                    </div>
                </div>
            )}{' '}
        </div>
    )
}
