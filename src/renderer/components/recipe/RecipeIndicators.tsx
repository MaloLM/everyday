import { Clock, Euro, CookingPot } from 'lucide-react'

interface RecipeIndicatorsProps {
    prepTime: number | null
    cost: number | null
    dishesCost: number | null
}

function formatPrepTime(minutes: number): string {
    if (minutes < 60) return `${minutes} min`
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m > 0 ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`
}

export const RecipeIndicators = ({ prepTime, cost, dishesCost }: RecipeIndicatorsProps) => {
    const hasAny = prepTime !== null || cost !== null || dishesCost !== null
    if (!hasAny) return null

    return (
        <div className="flex flex-wrap items-center gap-4 text-sm text-softWhite/70">
            {prepTime !== null && (
                <div className="flex items-center gap-1.5">
                    <Clock size={15} className="text-nobleGold" />
                    <span>{formatPrepTime(prepTime)}</span>
                </div>
            )}
            {cost !== null && (
                <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                        <Euro
                            key={i}
                            size={14}
                            className={i < cost ? 'text-nobleGold' : 'text-softWhite/20'}
                        />
                    ))}
                </div>
            )}
            {dishesCost !== null && (
                <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                        <CookingPot
                            key={i}
                            size={14}
                            className={i < dishesCost ? 'text-nobleGold' : 'text-softWhite/20'}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
