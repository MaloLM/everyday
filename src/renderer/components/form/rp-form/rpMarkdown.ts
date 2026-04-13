import {
    RecurringPurchaseItem,
    RecurringPurchasesData,
    CURRENCIES,
    computeAnnualCost,
    computeTotalAnnualCost,
} from '../../../utils'

function formatAmount(value: number): string {
    const rounded = Math.round(value * 100) / 100
    return rounded.toLocaleString('en-US', {
        minimumFractionDigits: rounded % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
    })
}

function formatRecurrence(item: RecurringPurchaseItem): string {
    const every = item.recurrence.every
    const unit = item.recurrence.unit
    if (every === 1) return `every ${unit}`
    return `every ${every} ${unit}s`
}

export function buildRecurringPurchasesMarkdown(data: RecurringPurchasesData): string {
    const symbol = CURRENCIES.get(data.currency) || data.currency
    const lines: string[] = []

    lines.push('# Recurring Purchases')
    lines.push('')

    const total = computeTotalAnnualCost(data.items)
    lines.push(`**Total:** ${formatAmount(total)} ${symbol} / year`)
    lines.push('')

    if (data.items.length === 0) {
        lines.push('_No recurring purchases._')
        return lines.join('\n') + '\n'
    }

    const groups = new Map<string, RecurringPurchaseItem[]>()
    for (const item of data.items) {
        const key = item.tag || 'Untagged'
        if (!groups.has(key)) groups.set(key, [])
        groups.get(key)!.push(item)
    }

    const sortedTags = [...groups.keys()].sort((a, b) => {
        if (a === 'Untagged') return 1
        if (b === 'Untagged') return -1
        return a.localeCompare(b)
    })

    for (const tag of sortedTags) {
        const items = groups.get(tag)!
        const groupTotal = computeTotalAnnualCost(items)
        lines.push(`## ${tag} — ${formatAmount(groupTotal)} ${symbol} / year`)
        lines.push('')
        lines.push('| Item | Unit Price | Quantity | Recurrence | Annual Cost |')
        lines.push('| --- | ---: | ---: | --- | ---: |')
        for (const item of items) {
            const name = `${item.emoji ? `${item.emoji} ` : ''}${item.name || 'Unnamed'}`.trim()
            const displayName = item.referenceUrl
                ? `[${name}](${item.referenceUrl})`
                : name
            const annual = computeAnnualCost(item)
            lines.push(
                `| ${displayName} | ${formatAmount(item.unitPrice)} ${symbol} | ${item.quantity} | ${formatRecurrence(item)} | ${formatAmount(annual)} ${symbol} |`
            )
        }
        lines.push('')
    }

    return lines.join('\n').trimEnd() + '\n'
}
