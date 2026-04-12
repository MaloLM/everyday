import { X } from 'lucide-react'
import { RecipeIngredient } from '../../../utils/types'
import { COMMON_UNITS } from '../../../utils/constants'

interface RecipeIngredientFormProps {
    ingredient: RecipeIngredient
    index: number
    onChange: (index: number, field: keyof RecipeIngredient, value: string) => void
    onDelete: (index: number) => void
    hasError?: boolean
}

export const RecipeIngredientForm = ({ ingredient, index, onChange, onDelete, hasError }: RecipeIngredientFormProps) => {
    return (
        <div
            className={`relative flex items-center gap-2 rounded-lg border bg-secondaryLightNobleBlack py-2 pl-2 pr-8 shadow-xl ${
                hasError ? 'border-error border-opacity-100' : 'border-nobleBlack border-opacity-100 hover:border-opacity-40'
            }`}
        >
            <input
                type="text"
                value={ingredient.quantity}
                onChange={(e) => onChange(index, 'quantity', e.target.value)}
                placeholder="Qté"
                className="field w-16 text-center text-sm"
            />
            <select
                value={ingredient.unit}
                onChange={(e) => onChange(index, 'unit', e.target.value)}
                className="field w-16 text-sm"
            >
                {COMMON_UNITS.map((u) => (
                    <option key={u} value={u}>
                        {u || '—'}
                    </option>
                ))}
            </select>
            <input
                type="text"
                value={ingredient.name}
                onChange={(e) => onChange(index, 'name', e.target.value)}
                placeholder="Ingredient name"
                className="field flex-1 text-sm"
            />
            <button
                type="button"
                onClick={() => onDelete(index)}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-softWhite/40 hover:text-error"
            >
                <X size={14} />
            </button>
        </div>
    )
}
