import { useMemo } from 'react'
import { Asset } from '../../../utils/types'
import { DonutChart } from '../../DonutChart'
import { COLORS } from '../../../utils/constants'

interface DonutChartProps {
    className?: string
    assets: Asset[]
}

export const TamDonutChart = ({ assets, className }: DonutChartProps) => {
    const { totalPurcentage, borderColor } = useMemo(() => {
        const total = assets.reduce(
            (acc: number, asset) =>
                acc + (typeof asset.targetPercent === 'string' ? parseInt(asset.targetPercent) : asset.targetPercent),
            0,
        )
        const color = total > 100 ? COLORS.error : total === 100 ? COLORS.nobleGold : COLORS.lightNobleBlack
        return { totalPurcentage: total, borderColor: color }
    }, [assets])

    const data = useMemo(() => ({
        labels: assets.map((asset) => asset.assetName),
        datasets: [
            {
                label: 'Asset Allocation',
                data: assets.map((asset) => asset.targetPercent),
                backgroundColor: [
                    '#eccba0',
                    '#a69151',
                    '#ad8851',
                    '#241935',
                    '#8c9364',
                    '#cfc1b2',
                    '#947c5c',
                    '#4c3c24',
                    '#d4c9b3',
                ],
                hoverOffset: 4,
                borderColor: borderColor,
                borderWidth: 2,
            },
        ],
    }), [assets, borderColor])

    return (
        <div className={'relative flex items-center justify-center ' + className}>
            <DonutChart data={data} />
            <span
                className={`absolute text-4xl font-bold ${totalPurcentage > 100 ? 'text-error' : totalPurcentage === 100 ? 'text-nobleGold' : ''}`}
            >
                {totalPurcentage > 999 || totalPurcentage < 0.1 || isNaN(totalPurcentage)
                    ? '???'
                    : totalPurcentage + '%'}
            </span>
        </div>
    )
}
