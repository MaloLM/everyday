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
}

export interface RecurringPurchasesData {
    items: RecurringPurchaseItem[]
    currency: string
}
