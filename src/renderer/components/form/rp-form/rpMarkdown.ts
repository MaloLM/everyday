import {
    RecurringPurchaseItem,
    RecurringPurchasesData,
    CURRENCIES,
    computeAnnualCost,
    computeTotalAnnualCost,
    convertAnnualToUnit,
    DISPLAY_UNIT_LABELS,
} from '../../../utils'
import type { DisplayUnit } from '../../../utils/constants'

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

export function buildRecurringPurchasesMarkdown(data: RecurringPurchasesData, displayUnit: DisplayUnit = 'year'): string {
    const symbol = CURRENCIES.get(data.currency) || data.currency
    const unitLabel = DISPLAY_UNIT_LABELS[displayUnit]
    const lines: string[] = []

    lines.push('# Recurring Purchases')
    lines.push('')

    const total = convertAnnualToUnit(computeTotalAnnualCost(data.items), displayUnit)
    lines.push(`**Total:** ${formatAmount(total)} ${symbol} ${unitLabel}`)
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
        const groupTotal = convertAnnualToUnit(computeTotalAnnualCost(items), displayUnit)
        lines.push(`## ${tag} — ${formatAmount(groupTotal)} ${symbol} ${unitLabel}`)
        lines.push('')
        lines.push(`| Item | Unit Price | Quantity | Recurrence | Cost ${unitLabel} |`)
        lines.push('| --- | ---: | ---: | --- | ---: |')
        for (const item of items) {
            const name = `${item.emoji ? `${item.emoji} ` : ''}${item.name || 'Unnamed'}`.trim()
            const displayName = item.referenceUrl
                ? `[${name}](${item.referenceUrl})`
                : name
            const cost = convertAnnualToUnit(computeAnnualCost(item), displayUnit)
            lines.push(
                `| ${displayName} | ${formatAmount(item.unitPrice)} ${symbol} | ${item.quantity} | ${formatRecurrence(item)} | ${formatAmount(cost)} ${symbol} |`
            )
        }
        lines.push('')
    }

    return lines.join('\n').trimEnd() + '\n'
}
