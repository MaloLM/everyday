import { useState, useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import { ipc } from '../api/electron'
import { Recipe } from '../utils/types'
import { Loading } from '../components/utils/Loading'
import { RecipeList } from '../components/recipe/RecipeList'
import { RecipeView } from '../components/recipe/RecipeView'
import { RecipeForm } from '../components/form/recipe-form/RecipeForm'
import toast from 'react-hot-toast'

export const Recipes = () => {
    const { recipesData, refreshRecipesData } = useAppContext()
    const { saveRecipe, deleteRecipe } = ipc
    const [isLoading, setIsLoading] = useState(true)
    const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        refreshRecipesData().finally(() => setIsLoading(false))
    }, [])

    const selectedRecipe = selectedRecipeId
        ? recipesData.recipes.find((r) => r.id === selectedRecipeId) ?? null
        : null

    const handleSave = async (recipe: Recipe) => {
        await saveRecipe(recipe)
        await refreshRecipesData()
        setSelectedRecipeId(recipe.id)
        setIsEditing(false)
    }

    const handleDelete = async (recipeId: string) => {
        await deleteRecipe(recipeId)
        await refreshRecipesData()
        if (selectedRecipeId === recipeId) {
            setSelectedRecipeId(null)
            setIsEditing(false)
        }
        toast.success('Recipe deleted')
    }

    const handleDuplicate = async (recipeId: string) => {
        const original = recipesData.recipes.find((r) => r.id === recipeId)
        if (!original) return

        const now = new Date().toISOString()
        const duplicate: Recipe = {
            ...original,
            id: crypto.randomUUID(),
            title: `Copy of ${original.title}`,
            ingredients: original.ingredients.map((ing) => ({ ...ing, id: crypto.randomUUID() })),
            tools: original.tools.map((tool) => ({ ...tool, id: crypto.randomUUID() })),
            createdAt: now,
            updatedAt: now,
        }

        await saveRecipe(duplicate)
        await refreshRecipesData()
        setSelectedRecipeId(duplicate.id)
        setIsEditing(true)
        toast.success('Recipe duplicated')
    }

    const handleNew = () => {
        setSelectedRecipeId(null)
        setIsEditing(true)
    }

    const handleBack = () => {
        setSelectedRecipeId(null)
        setIsEditing(false)
    }

    const handleCancelEdit = () => {
        if (selectedRecipe) {
            setIsEditing(false)
        } else {
            handleBack()
        }
    }

    if (isLoading) return <Loading />

    return (
        <div className="flex h-full flex-col">
            <h1 className="mb-5 font-serif text-4xl font-medium tracking-wider">Recipes</h1>

            {/* List mode */}
            {!selectedRecipeId && !isEditing && (
                <RecipeList
                    recipes={recipesData.recipes}
                    onSelect={(id) => { setSelectedRecipeId(id); setIsEditing(false) }}
                    onNew={handleNew}
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                />
            )}

            {/* View mode */}
            {selectedRecipe && !isEditing && (
                <RecipeView
                    recipe={selectedRecipe}
                    onEdit={() => setIsEditing(true)}
                    onDuplicate={() => handleDuplicate(selectedRecipe.id)}
                    onDelete={() => handleDelete(selectedRecipe.id)}
                    onBack={handleBack}
                />
            )}

            {/* Edit mode (new or existing) */}
            {isEditing && (
                <RecipeForm
                    recipe={selectedRecipe}
                    onSave={handleSave}
                    onCancel={handleCancelEdit}
                />
            )}
        </div>
    )
}
