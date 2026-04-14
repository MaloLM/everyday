import { SavingsProject, SavingsProjectsData } from '../../../utils/types'
import { CURRENCIES } from '../../../utils/constants'
import { computeProjectTotal, getMonthColumns } from '../../../utils/parse'

export function buildSavingsProjectsMarkdown(data: SavingsProjectsData): string {
    const symbol = CURRENCIES.get(data.currency) || data.currency
    const months = getMonthColumns(data.projects)

    const lines: string[] = []
    lines.push('# Savings Projects')
    lines.push('')

    const totalSaved = data.projects.reduce((sum, p) => sum + computeProjectTotal(p), 0)
    const totalObjective = data.projects.reduce((sum, p) => sum + (Number(p.objective) || 0), 0)
    lines.push(`**Total saved:** ${totalSaved.toLocaleString()} ${symbol} / ${totalObjective.toLocaleString()} ${symbol}`)
    lines.push('')

    if (data.projects.length === 0) {
        lines.push('No projects yet.')
        return lines.join('\n')
    }

    const header = ['Project', 'Objective', 'Total', 'Starting', ...months.map(formatMonthLabel)]
    const separator = header.map(() => '---')
    lines.push(`| ${header.join(' | ')} |`)
    lines.push(`| ${separator.join(' | ')} |`)

    for (const p of data.projects) {
        const total = computeProjectTotal(p)
        const row = [
            p.title || '-',
            `${(Number(p.objective) || 0).toLocaleString()} ${symbol}`,
            `${total.toLocaleString()} ${symbol}`,
            `${(Number(p.startingValue) || 0).toLocaleString()} ${symbol}`,
            ...months.map((m) => {
                const v = Number(p.monthlyContributions[m]) || 0
                return v ? `${v.toLocaleString()} ${symbol}` : '-'
            }),
        ]
        lines.push(`| ${row.join(' | ')} |`)
    }

    return lines.join('\n')
}

function formatMonthLabel(month: string): string {
    const [y, m] = month.split('-')
    const date = new Date(Number(y), Number(m) - 1)
    return date.toLocaleDateString('en', { month: 'short', year: '2-digit' })
}
