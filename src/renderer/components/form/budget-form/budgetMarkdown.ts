import { BudgetExpense, BudgetIncome, CURRENCIES, computeNetIncome, computeTotalExpenses } from '../../../utils'

function formatAmount(value: number, symbol: string): string {
    const rounded = Math.round(value * 100) / 100
    return `${rounded.toLocaleString('en-US', {
        minimumFractionDigits: rounded % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
    })} ${symbol}`
}

export function buildBudgetIncomesMarkdown(incomes: BudgetIncome[], currency: string): string {
    const symbol = CURRENCIES.get(currency) || currency
    const lines: string[] = []

    lines.push('# Monthly Income')
    lines.push('')

    const netTotal = computeNetIncome(incomes)
    lines.push(`**Net Total:** ${formatAmount(netTotal, symbol)}`)
    lines.push('')

    if (incomes.length === 0) {
        lines.push('_No income entries._')
        return lines.join('\n') + '\n'
    }

    lines.push('| Label | Gross | Deduction | Net |')
    lines.push('| --- | ---: | ---: | ---: |')
    for (const income of incomes) {
        const rate = Number(income.deductionRate) || 0
        const net = income.value * (1 - rate / 100)
        const tag = income.tag ? ` \`${income.tag}\`` : ''
        lines.push(
            `| ${income.label || 'Unnamed'}${tag} | ${formatAmount(income.value, symbol)} | ${rate}% | ${formatAmount(net, symbol)} |`
        )
    }
    lines.push('')

    return lines.join('\n').trimEnd() + '\n'
}

export function buildBudgetExpensesMarkdown(expenses: BudgetExpense[], currency: string): string {
    const symbol = CURRENCIES.get(currency) || currency
    const lines: string[] = []

    lines.push('# Monthly Expenses')
    lines.push('')

    const total = computeTotalExpenses(expenses)
    lines.push(`**Total:** ${formatAmount(total, symbol)}`)
    lines.push('')

    if (expenses.length === 0) {
        lines.push('_No expense entries._')
        return lines.join('\n') + '\n'
    }

    lines.push('| Label | Amount | Details |')
    lines.push('| --- | ---: | --- |')
    for (const expense of expenses) {
        const tag = expense.tag ? ` \`${expense.tag}\`` : ''
        lines.push(
            `| ${expense.label || 'Unnamed'}${tag} | ${formatAmount(expense.value, symbol)} | ${expense.details || '—'} |`
        )
    }
    lines.push('')

    return lines.join('\n').trimEnd() + '\n'
}
