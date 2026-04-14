import { BudgetData, ChartData, NetWorthData, RecurringPurchasesData, RecipesData, TamFormData } from './types'
import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../../tailwind.config'

const fullConfig = resolveConfig(tailwindConfig)

export const COLORS = {
    nobleGold: fullConfig.theme.colors.nobleGold,
    darkerNobleGold: fullConfig.theme.colors.darkerNobleGold,
    nobleBlack: fullConfig.theme.colors.nobleBlack,
    lightNobleBlack: fullConfig.theme.colors.lightNobleBlack,
    softWhite: fullConfig.theme.colors.softWhite,
    lightGray: fullConfig.theme.colors.lightGray,
    secondaryGold: fullConfig.theme.colors.secondaryGold,
    error: fullConfig.theme.colors.error,
}

// This is a mock chart data to display in the blured section
export const MOCK_CHART_DATA: ChartData = {
    labels: ['BTC', 'ETH', 'USDT', 'ADA', 'BNB', 'XRP', 'SOL', 'DOT', 'DOGE', 'USDC'],
    nbsToBuy: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.1, 0.2, 0.3, 0.4],
    targets: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.1, 0.2, 0.3, 0.4],
    datasets: [
        {
            label: 'Current',
            data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            backgroundColor: COLORS.secondaryGold,
            order: 1,
        },
        {
            label: 'Target',
            data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
            backgroundColor: COLORS.darkerNobleGold,
            order: 2,
        },
    ],
}

export const CURRENCIES = new Map<string, string>([
    ['USD', '$'], // US Dollar
    ['EUR', '€'], // Euro
    ['JPY', '¥'], // Japanese Yen
    ['GBP', '£'], // British Pound
    ['AUD', 'A$'], // Australian Dollar
    ['CAD', 'C$'], // Canadian Dollar
    ['CHF', 'CHF'], // Swiss Franc, no widely recognized symbol, use code
    ['CNH', '¥'], // Chinese Yuan (Offshore), same symbol as Yen
    ['SEK', 'kr'], // Swedish Krona
    ['NZD', 'NZ$'], // New Zealand Dollar
])

export const INIT_NW_DATA: NetWorthData = {
    entries: [],
    currency: 'EUR',
}

export const RECURRENCE_UNITS = ['day', 'week', 'month', 'year'] as const

export type DisplayUnit = typeof RECURRENCE_UNITS[number]

export const DISPLAY_UNIT_LABELS: Record<DisplayUnit, string> = {
    day: '/day',
    week: '/wk',
    month: '/mo',
    year: '/yr',
}

export const INIT_RP_DATA: RecurringPurchasesData = {
    items: [],
    currency: 'EUR',
}

export const COMMON_UNITS = [
    '', 'g', 'kg', 'ml', 'cl', 'L', 'tsp', 'tbsp', 'cup',
    'oz', 'lb', 'pinch', 'slice', 'piece', 'bunch', 'clove',
] as const

export const INIT_RECIPES_DATA: RecipesData = {
    recipes: [],
}

export const INIT_BUDGET_DATA: BudgetData = {
    expenses: [],
    incomes: [],
    currency: 'EUR',
}

export const INIT_TAM_DATA: TamFormData = {
    assets: [
        {
            id: crypto.randomUUID(),
            assetName: 'BTC',
            unitPrice: 149.92,
            quantityOwned: 2,
            targetPercent: 2,
        },
        {
            id: crypto.randomUUID(),
            assetName: 'ETH',
            unitPrice: 20.8,
            quantityOwned: 22,
            targetPercent: 33,
        },
        {
            id: crypto.randomUUID(),
            assetName: 'ESDT',
            unitPrice: 333.33,
            quantityOwned: 1,
            targetPercent: 6,
        },
        {
            id: crypto.randomUUID(),
            assetName: 'YAHOO',
            unitPrice: 271.93,
            quantityOwned: 1,
            targetPercent: 9,
        },
        {
            id: crypto.randomUUID(),
            assetName: 'WV',
            unitPrice: 477,
            quantityOwned: 2,
            targetPercent: 45,
        },
        {
            id: crypto.randomUUID(),
            assetName: 'BMW',
            unitPrice: 26.8,
            quantityOwned: 2,
            targetPercent: 5,
        },
    ],
    budget: 10000,
    currency: 'EUR',
}
