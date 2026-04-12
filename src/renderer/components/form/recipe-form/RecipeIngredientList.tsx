import { useRef } from 'react'
import { Plus } from 'lucide-react'
import { RecipeIngredient } from '../../../utils/types'
import { RecipeIngredientForm } from './RecipeIngredientForm'
import toast from 'react-hot-toast'

const MAX_INGREDIENTS = 100

interface RecipeIngredientListProps {
    ingredients: RecipeIngredient[]
    onChange: (ingredients: RecipeIngredient[]) => void
    errors?: any
}

export const RecipeIngredientList = ({ ingredients, onChange, errors }: RecipeIngredientListProps) => {
    const lastRef = useRef<HTMLDivElement>(null)

    const addIngredient = () => {
        if (ingredients.length >= MAX_INGREDIENTS) {
            toast.error('Maximum number of ingredients reached')
            return
        }
        onChange([
            ...ingredients,
            { id: crypto.randomUUID(), name: '', quantity: '', unit: '' },
        ])
        requestAnimationFrame(() => {
            lastRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        })
    }

    const handleChange = (index: number, field: keyof RecipeIngredient, value: string) => {
        const updated = [...ingredients]
        updated[index] = { ...updated[index], [field]: value }
        onChange(updated)
    }

    const handleDelete = (index: number) => {
        onChange(ingredients.filter((_, i) => i !== index))
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex max-h-[20rem] flex-col gap-1 overflow-y-auto py-1 pr-1">
                {ingredients.map((ingredient, index) => (
                    <div key={ingredient.id} ref={index === ingredients.length - 1 ? lastRef : undefined}>
                        <RecipeIngredientForm
                            ingredient={ingredient}
                            index={index}
                            onChange={handleChange}
                            onDelete={handleDelete}
                            hasError={errors?.[index]}
                        />
                    </div>
                ))}
                {ingredients.length === 0 && (
                    <div className="flex h-12 items-center justify-center">
                        <p className="text-sm text-softWhite/50">No ingredients added</p>
                    </div>
                )}
            </div>
            <button
                type="button"
                onClick={addIngredient}
                className="flex items-center gap-1 self-start rounded-lg border border-nobleGold/30 px-3 py-1 text-sm text-nobleGold transition-colors hover:bg-nobleGold/10"
            >
                <Plus size={14} /> Add ingredient
            </button>
        </div>
    )
}
