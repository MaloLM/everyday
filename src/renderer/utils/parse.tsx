import { ChartData, TamFormResponse, TamFormResponseAsset, TamFormData } from './types'
import { COLORS, INIT_TAM_DATA } from './constants'

export function parseTamFormData(input: string | object): TamFormData {
    const jsonString = typeof input === 'string' ? input : JSON.stringify(input)

    try {
        const data = JSON.parse(jsonString)
        if (Object.keys(data).length === 0) {
            return INIT_TAM_DATA
        }

        // Ensure each asset has an id for stable React keys
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
