import { useState } from 'react'
import { ArrowLeft, Pencil, Copy, Trash2, ClipboardCopy, Check } from 'lucide-react'
import { Recipe } from '../../utils/types'
import { Card } from '../Card'
import { ConfirmModal } from '../ConfirmModal'
import { RecipeIndicators } from './RecipeIndicators'
import { RecipeMarkdownRenderer } from './RecipeMarkdownRenderer'
import { buildRecipeMarkdown } from './recipeMarkdown'

interface RecipeViewProps {
    recipe: Recipe
    onEdit: () => void
    onDuplicate: () => void
    onDelete: () => void
    onBack: () => void
}

export const RecipeView = ({ recipe, onEdit, onDuplicate, onDelete, onBack }: RecipeViewProps) => {
    const [copied, setCopied] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)

    const handleCopyMarkdown = async () => {
        try {
            await navigator.clipboard.writeText(buildRecipeMarkdown(recipe))
            setCopied(true)
            setTimeout(() => setCopied(false), 1500)
        } catch {
            // Ignore clipboard failures silently
        }
    }

    return (
        <div className="flex flex-col gap-5">
            {/* Top bar */}
            <div className="flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="flex items-center gap-1 text-sm text-softWhite/60 transition-colors hover:text-nobleGold"
                >
                    <ArrowLeft size={16} /> Back
                </button>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onEdit}
                        className="flex items-center gap-1 rounded-lg border border-nobleGold/30 px-3 py-1.5 text-sm text-nobleGold transition-colors hover:bg-nobleGold/10"
                    >
                        <Pencil size={14} /> Edit
                    </button>
                    <button
                        onClick={handleCopyMarkdown}
                        className="flex items-center gap-1 rounded-lg border border-softWhite/20 px-3 py-1.5 text-sm text-softWhite/70 transition-colors hover:border-nobleGold/30 hover:text-nobleGold"
                    >
                        {copied ? <Check size={14} /> : <ClipboardCopy size={14} />}
                        {copied ? 'Copied' : 'Copy'}
                    </button>
                    <button
                        onClick={onDuplicate}
                        className="flex items-center gap-1 rounded-lg border border-softWhite/20 px-3 py-1.5 text-sm text-softWhite/70 transition-colors hover:border-nobleGold/30 hover:text-nobleGold"
                    >
                        <Copy size={14} /> Duplicate
                    </button>
                    <button
                        onClick={() => setConfirmOpen(true)}
                        className="flex items-center gap-1 rounded-lg border border-softWhite/20 px-3 py-1.5 text-sm text-softWhite/70 transition-colors hover:border-error/50 hover:text-error"
                    >
                        <Trash2 size={14} /> Delete
                    </button>
                </div>
            </div>

            <ConfirmModal
                isOpen={confirmOpen}
                title="Delete Recipe"
                message={`Are you sure you want to delete "${recipe.title || 'Untitled'}"? This action cannot be undone.`}
                confirmLabel="Delete"
                onConfirm={() => { setConfirmOpen(false); onDelete() }}
                onCancel={() => setConfirmOpen(false)}
                danger
            />

            {/* Title */}
            <h2 className="font-serif text-3xl font-medium tracking-wider text-nobleGold">
                {recipe.title}
            </h2>

            {/* Indicators */}
            <RecipeIndicators
                prepTime={recipe.prepTime}
                cost={recipe.cost}
                dishesCost={recipe.dishesCost}
            />

            {/* Ingredients & Tools side by side */}
            <div className="grid gap-5 lg:grid-cols-2">
                {recipe.ingredients.length > 0 && (
                    <Card title="Ingredients">
                        <ul className="flex flex-col gap-1.5">
                            {recipe.ingredients.map((ing) => (
                                <li key={ing.id} className="flex items-baseline gap-2 text-sm">
                                    <span className="text-nobleGold">-</span>
                                    {ing.quantity && (
                                        <span className="font-medium text-nobleGold">
                                            {ing.quantity}{ing.unit ? ` ${ing.unit}` : ''}
                                        </span>
                                    )}
                                    <span className="text-softWhite">{ing.name}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                )}
                {recipe.tools.length > 0 && (
                    <Card title="Tools">
                        <ul className="flex flex-col gap-1.5">
                            {recipe.tools.map((tool) => (
                                <li key={tool.id} className="flex items-baseline gap-2 text-sm">
                                    <span className="text-nobleGold">-</span>
                                    <span className="text-softWhite">{tool.name}</span>
                                </li>
                            ))}
                        </ul>
                    </Card>
                )}
            </div>

            {/* Instructions */}
            {recipe.instructions && (
                <Card title="Instructions">
                    <RecipeMarkdownRenderer content={recipe.instructions} />
                </Card>
            )}
        </div>
    )
}
