import { useState } from 'react'
import { Plus, Trash2, Copy, Search, Clock } from 'lucide-react'
import { Recipe } from '../../utils/types'
import { RecipeIndicators } from './RecipeIndicators'

interface RecipeListProps {
    recipes: Recipe[]
    onSelect: (recipeId: string) => void
    onNew: () => void
    onDelete: (recipeId: string) => void
    onDuplicate: (recipeId: string) => void
}

export const RecipeList = ({ recipes, onSelect, onNew, onDelete, onDuplicate }: RecipeListProps) => {
    const [search, setSearch] = useState('')

    const filtered = recipes
        .filter((r) => r.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => (b.updatedAt || b.createdAt || '').localeCompare(a.updatedAt || a.createdAt || ''))

    return (
        <div className="flex flex-col gap-4">
            {/* Search + New */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-softWhite/40" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search recipes..."
                        className="w-full rounded-lg border border-lightGray bg-lightNobleBlack py-2 pl-9 pr-3 text-sm text-softWhite placeholder-softWhite/30 focus:border-nobleGold/50 focus:outline-none"
                    />
                </div>
                <button
                    onClick={onNew}
                    className="flex items-center gap-1.5 rounded-lg border border-nobleGold/40 bg-nobleGold/10 px-4 py-2 text-sm font-medium text-nobleGold transition-colors hover:bg-nobleGold/20"
                >
                    <Plus size={16} /> New Recipe
                </button>
            </div>

            {/* Recipe cards */}
            {filtered.length === 0 && (
                <div className="flex h-40 items-center justify-center">
                    <p className="text-softWhite/50">
                        {recipes.length === 0 ? 'No recipes yet. Create your first one!' : 'No recipes match your search.'}
                    </p>
                </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filtered.map((recipe) => (
                    <div
                        key={recipe.id}
                        onClick={() => onSelect(recipe.id)}
                        className="group relative cursor-pointer rounded-xl border border-lightGray bg-lightNobleBlack p-5 transition-all hover:border-nobleGold/30 hover:shadow-lg"
                    >
                        <h3 className="mb-2 font-serif text-lg font-medium tracking-wide text-nobleGold">
                            {recipe.title || 'Untitled'}
                        </h3>
                        <RecipeIndicators
                            prepTime={recipe.prepTime}
                            cost={recipe.cost}
                            dishesCost={recipe.dishesCost}
                        />
                        <div className="mt-2 flex items-center justify-between">
                            <span className="text-xs text-softWhite/30">
                                {recipe.ingredients.length > 0 && `${recipe.ingredients.length} ingredient${recipe.ingredients.length > 1 ? 's' : ''}`}
                            </span>
                            {recipe.prepTime !== null && (
                                <span className="flex items-center gap-1 text-xs text-softWhite/40">
                                    <Clock size={11} />
                                    {recipe.prepTime} min
                                </span>
                            )}
                        </div>

                        {/* Hover actions */}
                        <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                                onClick={(e) => { e.stopPropagation(); onDuplicate(recipe.id) }}
                                className="rounded p-1 text-softWhite/40 transition-colors hover:text-nobleGold"
                                title="Duplicate"
                            >
                                <Copy size={14} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); onDelete(recipe.id) }}
                                className="rounded p-1 text-softWhite/40 transition-colors hover:text-error"
                                title="Delete"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
