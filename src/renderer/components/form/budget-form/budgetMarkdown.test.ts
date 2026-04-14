import { describe, it, expect } from 'vitest'
import { buildBudgetIncomesMarkdown, buildBudgetExpensesMarkdown } from './budgetMarkdown'

const makeIncome = (overrides = {}) => ({
    id: '1', label: 'Salary', value: 3000, deductionRate: 25, tag: 'Job',
    ...overrides,
})

const makeExpense = (overrides = {}) => ({
    id: '1', label: 'Rent', value: 1200, details: 'Monthly rent', tag: 'Housing',
    ...overrides,
})

describe('buildBudgetIncomesMarkdown', () => {
    it('builds markdown with net total', () => {
        const md = buildBudgetIncomesMarkdown([makeIncome()], 'EUR')
        expect(md).toContain('# Monthly Income')
        expect(md).toContain('**Net Total:** 2,250 €')
        expect(md).toContain('| Salary `Job` | 3,000 € | 25% | 2,250 € |')
    })

    it('handles zero deduction rate', () => {
        const md = buildBudgetIncomesMarkdown([makeIncome({ deductionRate: 0 })], 'USD')
        expect(md).toContain('**Net Total:** 3,000 $')
        expect(md).toContain('| 0% |')
    })

    it('shows empty message when no items', () => {
        const md = buildBudgetIncomesMarkdown([], 'EUR')
        expect(md).toContain('_No income entries._')
    })
})

describe('buildBudgetExpensesMarkdown', () => {
    it('builds markdown with total', () => {
        const md = buildBudgetExpensesMarkdown([makeExpense()], 'EUR')
        expect(md).toContain('# Monthly Expenses')
        expect(md).toContain('**Total:** 1,200 €')
        expect(md).toContain('| Rent `Housing` | 1,200 € | Monthly rent |')
    })

    it('shows dash for empty details', () => {
        const md = buildBudgetExpensesMarkdown([makeExpense({ details: '' })], 'EUR')
        expect(md).toContain('| — |')
    })

    it('shows empty message when no items', () => {
        const md = buildBudgetExpensesMarkdown([], 'EUR')
        expect(md).toContain('_No expense entries._')
    })
})
