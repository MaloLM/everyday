export interface Asset {
    id: string
    assetName: string
    unitPrice: number
    quantityOwned: number
    targetPercent: number
}

export interface TamFormData {
    assets: Asset[]
    currency: string
    budget: number
}

export interface TamFormResponseAsset {
    assetName: string
    unitPrice: number
    oldQuantity: number
    newQuantity: number
    additionalQuantity: number
    assetProp: number
    newProp: number
}

export interface TamFormResponse {
    assets: TamFormResponseAsset[]
}

export interface ChartData {
    labels: string[]
    nbsToBuy: number[]
    targets: number[]
    datasets: {
        label: string
        data: number[]
        backgroundColor: string
        order: number
    }[]
}

export interface NetWorthItem {
    id: string
    name: string
    estimatedValue: number
}

export interface NetWorthEntry {
    id: string
    date: string
    items: NetWorthItem[]
}

export interface NetWorthData {
    entries: NetWorthEntry[]
    currency: string
}

export interface RecurrenceConfig {
    every: number
    unit: 'day' | 'week' | 'month' | 'year'
}

export interface RecurringPurchaseItem {
    id: string
    emoji: string
    name: string
    unitPrice: number
    quantity: number
    recurrence: RecurrenceConfig
    tag: string
    referenceUrl?: string
}

export interface RecurringPurchasesData {
    items: RecurringPurchaseItem[]
    currency: string
}

export interface RecipeIngredient {
    id: string
    name: string
    quantity: string
    unit: string
}

export interface RecipeTool {
    id: string
    name: string
}

export interface Recipe {
    id: string
    title: string
    instructions: string
    ingredients: RecipeIngredient[]
    tools: RecipeTool[]
    prepTime: number | null
    cost: number | null
    dishesCost: number | null
    createdAt: string
    updatedAt: string
}

export interface RecipesData {
    recipes: Recipe[]
}

export interface BudgetExpense {
    id: string
    label: string
    value: number
    details: string
    tag: string
}

export interface BudgetIncome {
    id: string
    label: string
    value: number
    deductionRate: number
    tag: string
}

export interface BudgetData {
    expenses: BudgetExpense[]
    incomes: BudgetIncome[]
    currency: string
}
