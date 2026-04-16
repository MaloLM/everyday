import { useMemo } from 'react'
import { Asset } from '../../../utils/types'
import { DonutChart } from '../../DonutChart'
import { COLORS, TAG_COLORS } from '../../../utils/constants'

interface DonutChartProps {
    className?: string
    assets: Asset[]
}

export const TamDonutChart = ({ assets, className }: DonutChartProps) => {
    const totalPurcentage = useMemo(() => {
        return assets.reduce(
            (acc: number, asset) =>
                acc + (typeof asset.targetPercent === 'string' ? parseInt(asset.targetPercent) : asset.targetPercent),
            0,
        )
    }, [assets])

    const data = useMemo(() => {
        // Build indexed entries then sort by value descending for the chart
        const indexed = assets.map((asset, i) => ({
            label: asset.assetName,
            value: asset.targetPercent,
            color: TAG_COLORS[i % TAG_COLORS.length],
        }))
        const sorted = [...indexed].sort((a, b) => Number(b.value) - Number(a.value))

        return {
            labels: sorted.map((e) => e.label),
            datasets: [
                {
                    label: 'Asset Allocation',
                    data: sorted.map((e) => e.value),
                    backgroundColor: sorted.map((e) => e.color),
                    hoverOffset: 4,
                    borderColor: COLORS.lightNobleBlack,
                    borderWidth: 2,
                },
            ],
        }
    }, [assets])

    return (
        <div className={'flex flex-col items-center gap-2 ' + className}>
            <div className="relative flex items-center justify-center">
                <DonutChart data={data} />
                <span
                    className={`absolute text-4xl font-bold ${totalPurcentage > 100 ? 'text-error' : totalPurcentage === 100 ? 'text-nobleGold' : ''}`}
                >
                    {totalPurcentage > 999 || totalPurcentage < 0.1 || isNaN(totalPurcentage)
                        ? '???'
                        : totalPurcentage + '%'}
                </span>
            </div>
            <h3 className="text-sm font-medium text-softWhite/70">Target Allocation</h3>
        </div>
    )
}
