import { SavingsProject } from '../../../utils/types'
import { computeProjectTotal } from '../../../utils/parse'
import { CURRENCIES } from '../../../utils/constants'
import { TextField } from '../TextField'
import { NumberField } from '../NumberField'
import { Trash2 } from 'lucide-react'

interface SpProjectRowProps {
    index: number
    project: SavingsProject
    currency: string
    onDelete: () => void
}

export const SpProjectRow = ({ index, project, currency, onDelete }: SpProjectRowProps) => {
    const currencySymbol = CURRENCIES.get(currency) || currency
    const total = computeProjectTotal(project)
    const objective = Number(project.objective) || 0
    const rawPercent = objective > 0 ? (total / objective) * 100 : 0
    const barWidth = Math.min(100, Math.max(0, rawPercent))
    const exceeded = rawPercent >= 100

    const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 0 })

    return (
        <>
            <td className="px-1 py-1">
                <button
                    type="button"
                    onClick={onDelete}
                    title="Remove project"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-softWhite/40 transition-colors hover:bg-error/20 hover:text-error"
                >
                    <Trash2 size={14} />
                </button>
            </td>
            <td className="px-1 py-1">
                <TextField
                    name={`projects[${index}].title`}
                    placeholder="Project name"
                    className="!min-w-32"
                />
            </td>
            <td className="px-1 py-1">
                <NumberField
                    name={`projects[${index}].objective`}
                    placeholder="0"
                    currency={currencySymbol}
                    className="!max-w-20"
                />
            </td>
            <td className="px-2 py-1">
                <div className="flex min-w-28 flex-col gap-1">
                    <div className="flex items-baseline justify-between">
                        <span className={`fin-value whitespace-nowrap text-sm font-semibold ${exceeded ? 'text-succesGreen' : 'text-nobleGold'}`}>
                            {fmt(total)}
                        </span>
                        {objective > 0 && (
                            <span className="fin-value whitespace-nowrap text-xs text-softWhite/40">
                                / {fmt(objective)} {currencySymbol}
                            </span>
                        )}
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-white/25">
                        <div
                            className={`h-full rounded-full ${exceeded ? 'bg-succesGreen' : 'bg-nobleGold'}`}
                            style={{ width: `${barWidth}%` }}
                        />
                    </div>
                    <span className={`text-xs ${exceeded ? 'font-semibold text-succesGreen' : 'text-softWhite/50'}`}>
                        {rawPercent.toFixed(0)}%
                    </span>
                </div>
            </td>
            <td className="px-1 py-1">
                <NumberField
                    name={`projects[${index}].startingValue`}
                    placeholder="0"
                    currency={currencySymbol}
                    allowNegative
                    className="!max-w-20"
                />
            </td>
        </>
    )
}
