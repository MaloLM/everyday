import { Recipe } from '../../utils/types'

function formatPrepTime(minutes: number): string {
    if (minutes < 60) return `${minutes} min`
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return m > 0 ? `${h}h${String(m).padStart(2, '0')}` : `${h}h`
}

function formatRating(value: number, filled: string, empty = '·'): string {
    const v = Math.max(0, Math.min(5, Math.round(value)))
    return `${filled.repeat(v)}${empty.repeat(5 - v)} (${v}/5)`
}

export function buildRecipeMarkdown(recipe: Recipe): string {
    const lines: string[] = []

    lines.push(`# ${recipe.title || 'Untitled recipe'}`)
    lines.push('')

    const meta: string[] = []
    if (recipe.prepTime !== null) {
        meta.push(`- **Prep time:** ${formatPrepTime(recipe.prepTime)}`)
    }
    if (recipe.cost !== null) {
        meta.push(`- **Cost:** ${formatRating(recipe.cost, '€')}`)
    }
    if (recipe.dishesCost !== null) {
        meta.push(`- **Dishes to clean:** ${formatRating(recipe.dishesCost, '🍳')}`)
    }
    if (meta.length > 0) {
        lines.push(...meta)
        lines.push('')
    }

    if (recipe.ingredients.length > 0) {
        lines.push('## Ingredients')
        lines.push('')
        for (const ing of recipe.ingredients) {
            const qty = ing.quantity ? `**${ing.quantity}${ing.unit ? ` ${ing.unit}` : ''}** ` : ''
            lines.push(`- ${qty}${ing.name}`.trimEnd())
        }
        lines.push('')
    }

    if (recipe.tools.length > 0) {
        lines.push('## Tools')
        lines.push('')
        for (const tool of recipe.tools) {
            lines.push(`- ${tool.name}`)
        }
        lines.push('')
    }

    if (recipe.instructions.trim()) {
        lines.push('## Instructions')
        lines.push('')
        lines.push(recipe.instructions.trim())
        lines.push('')
    }

    return lines.join('\n').trimEnd() + '\n'
}
