import { X } from 'lucide-react'
import { RecipeTool } from '../../../utils/types'

interface RecipeToolFormProps {
    tool: RecipeTool
    index: number
    onChange: (index: number, value: string) => void
    onDelete: (index: number) => void
    hasError?: boolean
}

export const RecipeToolForm = ({ tool, index, onChange, onDelete, hasError }: RecipeToolFormProps) => {
    return (
        <div
            className={`relative flex items-center gap-2 rounded-lg border bg-secondaryLightNobleBlack py-2 pl-2 pr-8 shadow-xl ${
                hasError ? 'border-error border-opacity-100' : 'border-nobleBlack border-opacity-100 hover:border-opacity-40'
            }`}
        >
            <input
                type="text"
                value={tool.name}
                onChange={(e) => onChange(index, e.target.value)}
                placeholder="Tool name"
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
