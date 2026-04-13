import { Asset, CURRENCIES } from '../../../utils'

function formatAmount(value: number): string {
    const rounded = Math.round(value * 100) / 100
    return rounded.toLocaleString('en-US', {
        minimumFractionDigits: rounded % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
    })
}

function formatPercent(value: number): string {
    const rounded = Math.round(value * 10) / 10
    return `${rounded}%`
}

interface TamSnapshot {
    assets: Asset[]
    currency: string
    budget: number
}

export function buildTargetAllocationMarkdown(snapshot: TamSnapshot): string {
    const symbol = CURRENCIES.get(snapshot.currency) || snapshot.currency
    const lines: string[] = []

    lines.push('# Current Target Allocation')
    lines.push('')

    const portfolioValue = snapshot.assets.reduce(
        (sum, a) => sum + (Number(a.unitPrice) || 0) * (Number(a.quantityOwned) || 0),
        0
    )
    lines.push(`- **Portfolio value:** ${formatAmount(portfolioValue)} ${symbol}`)
    lines.push(`- **Budget:** ${formatAmount(snapshot.budget)} ${symbol}`)
    lines.push(`- **Currency:** ${snapshot.currency}`)
    lines.push('')

    if (snapshot.assets.length === 0) {
        lines.push('_No assets configured._')
        return lines.join('\n') + '\n'
    }

    lines.push('## Assets')
    lines.push('')
    lines.push('| Asset | Unit Price | Quantity | Value | Current % | Target % |')
    lines.push('| --- | ---: | ---: | ---: | ---: | ---: |')

    for (const asset of snapshot.assets) {
        const unitPrice = Number(asset.unitPrice) || 0
        const quantity = Number(asset.quantityOwned) || 0
        const value = unitPrice * quantity
        const currentPct = portfolioValue > 0 ? (value / portfolioValue) * 100 : 0
        lines.push(
            `| ${asset.assetName || 'Unnamed'} | ${formatAmount(unitPrice)} ${symbol} | ${quantity} | ${formatAmount(value)} ${symbol} | ${formatPercent(currentPct)} | ${formatPercent(asset.targetPercent)} |`
        )
    }

    return lines.join('\n').trimEnd() + '\n'
}
