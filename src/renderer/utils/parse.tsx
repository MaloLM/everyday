import { BudgetData, BudgetExpense, BudgetIncome, ChartData, ExpenseAnalysisData, GiftIdeasData, TamFormResponse, TamFormResponseAsset, TamFormData, NetWorthData, NetWorthEntry, RecurringPurchasesData, RecurringPurchaseItem, RecipesData, SavingsProject, SavingsProjectsData } from './types'
import { COLORS, INIT_TAM_DATA, INIT_NW_DATA, INIT_RP_DATA, INIT_RECIPES_DATA, INIT_BUDGET_DATA, INIT_SP_DATA, INIT_EA_DATA, INIT_GIFT_IDEAS_DATA } from './constants'

// ---------------------------------------------------------------------------
// Generic parser factory
// ---------------------------------------------------------------------------

interface ParseSpec<T> {
    rootKey: string
    nestedArrays?: string[]
    initData: T
    /** Extra post-processing after UUID assignment (e.g. default fields) */
    postProcess?: (data: any) => void
}

function createParser<T>(spec: ParseSpec<T>): (input: string | object) => T {
    return (input) => {
        const jsonString = typeof input === 'string' ? input : JSON.stringify(input)
        try {
            const data = JSON.parse(jsonString)
            if (!data || Object.keys(data).length === 0 || !data[spec.rootKey]) {
                return spec.initData
            }

            data[spec.rootKey] = data[spec.rootKey].map((item: any) => {
                const withId = { ...item, id: item.id ?? crypto.randomUUID() }
                if (spec.nestedArrays) {
                    for (const key of spec.nestedArrays) {
                        withId[key] = (item[key] || []).map((sub: any) => ({
                            ...sub,
                            id: sub.id ?? crypto.randomUUID(),
                        }))
                    }
                }
                return withId
            })

            spec.postProcess?.(data)
            return data as T
        } catch {
            return spec.initData
        }
    }
}

// ---------------------------------------------------------------------------
// TAM – special: throws on invalid JSON, different empty check
// ---------------------------------------------------------------------------

export function parseTamFormData(input: string | object): TamFormData {
    const jsonString = typeof input === 'string' ? input : JSON.stringify(input)

    try {
        const data = JSON.parse(jsonString)
        if (Object.keys(data).length === 0) {
            return INIT_TAM_DATA
        }

        if (data.assets) {
            data.assets = data.assets.map((asset: any) => ({
                ...asset,
                id: asset.id ?? crypto.randomUUID(),
            }))
        }

        return data as TamFormData
    } catch (error) {
        throw new Error('Failed to parse JSON data')
    }
}

// ---------------------------------------------------------------------------
// Budget – special: checks two root keys (expenses OR incomes)
// ---------------------------------------------------------------------------

export function parseBudgetData(input: string | object): BudgetData {
    const jsonString = typeof input === 'string' ? input : JSON.stringify(input)

    try {
        const data = JSON.parse(jsonString)
        if (!data || Object.keys(data).length === 0 || (!data.expenses && !data.incomes)) {
            return INIT_BUDGET_DATA
        }

        data.expenses = (data.expenses || []).map((item: any) => ({
            ...item,
            id: item.id ?? crypto.randomUUID(),
        }))
        data.incomes = (data.incomes || []).map((item: any) => ({
            ...item,
            id: item.id ?? crypto.randomUUID(),
        }))

        return data as BudgetData
    } catch {
        return INIT_BUDGET_DATA
    }
}

// ---------------------------------------------------------------------------
// Standard parsers via factory
// ---------------------------------------------------------------------------

export const parseNetWorthData = createParser<NetWorthData>({
    rootKey: 'entries',
    nestedArrays: ['items'],
    initData: INIT_NW_DATA,
})

export const parseRpData = createParser<RecurringPurchasesData>({
    rootKey: 'items',
    initData: INIT_RP_DATA,
})

export const parseRecipesData = createParser<RecipesData>({
    rootKey: 'recipes',
    nestedArrays: ['ingredients', 'tools'],
    initData: INIT_RECIPES_DATA,
})

export const parseSavingsProjectsData = createParser<SavingsProjectsData>({
    rootKey: 'projects',
    initData: INIT_SP_DATA,
    postProcess: (data) => {
        data.projects = data.projects.map((p: any) => ({
            ...p,
            monthlyContributions: p.monthlyContributions ?? {},
        }))
    },
})

export const parseEaData = createParser<ExpenseAnalysisData>({
    rootKey: 'imports',
    nestedArrays: ['transactions'],
    initData: INIT_EA_DATA,
    postProcess: (data) => {
        if (!Array.isArray(data.tags)) {
            data.tags = []
        }
    },
})

export const parseGiftIdeasData = createParser<GiftIdeasData>({
    rootKey: 'ideas',
    initData: INIT_GIFT_IDEAS_DATA,
    postProcess: (data) => {
        data.ideas = data.ideas.map((idea: any) => ({
            ...idea,
            offered: idea.offered ?? false,
        }))
    },
})

// ---------------------------------------------------------------------------
// TAM response / chart helpers
// ---------------------------------------------------------------------------

export function parseToTamResponse(input: any): TamFormResponse {
    if (Array.isArray(input) && input.every((asset) => typeof asset === 'object' && 'assetName' in asset)) {
        return { assets: input as TamFormResponseAsset[] }
    } else {
        throw new Error('Invalid input type or structure for parseToTamResponse')
    }
}

export function parseToChartData(tamResponse: TamFormResponse): ChartData {
    let labels: string[] = []
    let oldQuantities: number[] = []
    let quantitiesToBuy: number[] = []
    let nbsToBuy: number[] = []
    let targets: number[] = []

    for (const asset of tamResponse.assets) {
        const label = `${asset.assetName} (${asset.newProp}%)`
        const oldQ = asset.oldQuantity * asset.unitPrice
        const nbToBuy = asset.additionalQuantity
        const QtoBuy = nbToBuy * asset.unitPrice
        const target = asset.assetProp * asset.unitPrice

        labels.push(label)
        oldQuantities.push(oldQ)
        quantitiesToBuy.push(QtoBuy)
        nbsToBuy.push(nbToBuy)
        targets.push(target)
    }

    const data: ChartData = {
        labels: labels,
        nbsToBuy: nbsToBuy,
        targets: targets,
        datasets: [
            {
                label: 'Current Volume',
                data: oldQuantities,
                backgroundColor: COLORS.secondaryGold,
                order: 2,
            },
            {
                label: 'Next Buy',
                data: quantitiesToBuy,
                backgroundColor: COLORS.darkerNobleGold,
                order: 2,
            },
        ],
    }

    return data
}

// ---------------------------------------------------------------------------
// Net worth helpers
// ---------------------------------------------------------------------------

export function computeNetWorth(entry: NetWorthEntry): number {
    return entry.items.reduce((sum, item) => sum + item.estimatedValue, 0)
}

// ---------------------------------------------------------------------------
// Recurring purchases helpers
// ---------------------------------------------------------------------------

export function convertAnnualToUnit(annualCost: number, unit: 'day' | 'week' | 'month' | 'year'): number {
    switch (unit) {
        case 'day':   return annualCost / 365
        case 'week':  return annualCost / 52
        case 'month': return annualCost / 12
        case 'year':  return annualCost
        default:      return annualCost
    }
}

export function computeAnnualCost(item: RecurringPurchaseItem): number {
    const { every, unit } = item.recurrence
    if (every <= 0) return 0
    let occurrencesPerYear: number
    switch (unit) {
        case 'day':   occurrencesPerYear = 365 / every; break
        case 'week':  occurrencesPerYear = 52 / every; break
        case 'month': occurrencesPerYear = 12 / every; break
        case 'year':  occurrencesPerYear = 1 / every; break
        default:      occurrencesPerYear = 0
    }
    return item.unitPrice * item.quantity * occurrencesPerYear
}

export function computeTotalAnnualCost(items: RecurringPurchaseItem[]): number {
    return items.reduce((sum, item) => sum + computeAnnualCost(item), 0)
}

// ---------------------------------------------------------------------------
// Budget helpers
// ---------------------------------------------------------------------------

export function computeNetIncome(incomes: BudgetIncome[]): number {
    return incomes.reduce((sum, income) => {
        const rate = Number(income.deductionRate) || 0
        return sum + income.value * (1 - rate / 100)
    }, 0)
}

export function computeTotalExpenses(expenses: BudgetExpense[]): number {
    return expenses.reduce((sum, expense) => sum + expense.value, 0)
}

// ---------------------------------------------------------------------------
// Savings projects helpers
// ---------------------------------------------------------------------------

export function computeProjectTotal(project: SavingsProject): number {
    return (Number(project.startingValue) || 0) +
        Object.values(project.monthlyContributions).reduce((sum, v) => sum + (Number(v) || 0), 0)
}

export function getMonthColumns(projects: SavingsProject[], extraMonths = 11): string[] {
    const allKeys: string[] = []
    for (const p of projects) {
        allKeys.push(...Object.keys(p.monthlyContributions))
    }

    const now = new Date()
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`

    const sorted = allKeys.filter((k) => /^\d{4}-\d{2}$/.test(k)).sort((a, b) => a.localeCompare(b))
    const startMonth = sorted.length > 0 && sorted[0] < currentMonth ? sorted[0] : currentMonth
    const latestKey = sorted.length > 0 ? sorted[sorted.length - 1] : currentMonth

    // End = whichever is further: now + extra OR latest contribution + extra
    const endFromNow = new Date(now.getFullYear(), now.getMonth() + extraMonths, 1)
    const [latestY, latestM] = latestKey.split('-').map(Number)
    const endFromLatest = new Date(latestY, latestM - 1 + extraMonths, 1)
    const endDate = endFromNow > endFromLatest ? endFromNow : endFromLatest

    const result: string[] = []
    const [startY, startM] = startMonth.split('-').map(Number)

    let y = startY
    let m = startM
    while (true) {
        const key = `${y}-${String(m).padStart(2, '0')}`
        result.push(key)
        const d = new Date(y, m, 1)
        if (d > endDate) break
        m++
        if (m > 12) { m = 1; y++ }
    }

    return result
}
