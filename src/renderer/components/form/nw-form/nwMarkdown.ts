import { NetWorthEntry, CURRENCIES, computeNetWorth } from '../../../utils'

function formatAmount(value: number): string {
    return value.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    })
}

function formatPercent(value: number): string {
    const rounded = Math.round(value * 10) / 10
    return `${rounded}%`
}

export function buildNetWorthEntryMarkdown(entry: NetWorthEntry, currency: string): string {
    const symbol = CURRENCIES.get(currency) || currency
    const lines: string[] = []

    lines.push(`# Net Worth Audit — ${entry.date}`)
    lines.push('')

    const total = computeNetWorth(entry)
    lines.push(`**Net Worth:** ${formatAmount(total)} ${symbol}`)
    lines.push('')

    if (entry.items.length === 0) {
        lines.push('_No items._')
        return lines.join('\n') + '\n'
    }

    lines.push('## Items')
    lines.push('')
    lines.push('| Item | Value | Share |')
    lines.push('| --- | ---: | ---: |')

    const absTotal = entry.items.reduce((sum, i) => sum + Math.abs(Number(i.estimatedValue) || 0), 0)

    for (const item of entry.items) {
        const value = Number(item.estimatedValue) || 0
        const share = absTotal > 0 ? (Math.abs(value) / absTotal) * 100 : 0
        lines.push(`| ${item.name || 'Unnamed'} | ${formatAmount(value)} ${symbol} | ${formatPercent(share)} |`)
    }

    return lines.join('\n').trimEnd() + '\n'
}
