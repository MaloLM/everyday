import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BudgetCharts } from './BudgetCharts'

describe('BudgetCharts', () => {
    it('renders income vs expenses label', () => {
        render(
            <BudgetCharts
                incomes={[]}
                expenses={[]}
                currencySymbol="€"
            />
        )
        expect(screen.getByText('Income vs Expenses')).toBeInTheDocument()
    })

    it('shows dash when no data', () => {
        render(
            <BudgetCharts
                incomes={[]}
                expenses={[]}
                currencySymbol="€"
            />
        )
        expect(screen.getByText('—')).toBeInTheDocument()
    })

    it('shows positive balance when income exceeds expenses', () => {
        render(
            <BudgetCharts
                incomes={[{ id: '1', label: 'Salary', value: 3000, deductionRate: 0, tag: '' }]}
                expenses={[{ id: '2', label: 'Rent', value: 1000, details: '', tag: '' }]}
                currencySymbol="€"
            />
        )
        expect(screen.getByText(/\+2.?000 €/)).toBeInTheDocument()
    })

    it('shows negative balance when expenses exceed income', () => {
        render(
            <BudgetCharts
                incomes={[{ id: '1', label: 'Salary', value: 1000, deductionRate: 0, tag: '' }]}
                expenses={[{ id: '2', label: 'Rent', value: 3000, details: '', tag: '' }]}
                currencySymbol="€"
            />
        )
        expect(screen.getByText(/-2.?000 €/)).toBeInTheDocument()
    })

    it('renders income by tag section when incomes present', () => {
        render(
            <BudgetCharts
                incomes={[{ id: '1', label: 'Salary', value: 3000, deductionRate: 0, tag: 'Job' }]}
                expenses={[]}
                currencySymbol="€"
            />
        )
        expect(screen.getByText('Income by Tag')).toBeInTheDocument()
        expect(screen.getByText('Job')).toBeInTheDocument()
    })

    it('renders expenses by tag section when expenses present', () => {
        render(
            <BudgetCharts
                incomes={[]}
                expenses={[{ id: '1', label: 'Rent', value: 1200, details: '', tag: 'Housing' }]}
                currencySymbol="€"
            />
        )
        expect(screen.getByText('Expenses by Tag')).toBeInTheDocument()
        expect(screen.getByText('Housing')).toBeInTheDocument()
    })

    it('accounts for deduction rate in balance', () => {
        render(
            <BudgetCharts
                incomes={[{ id: '1', label: 'Salary', value: 2000, deductionRate: 50, tag: '' }]}
                expenses={[{ id: '2', label: 'Rent', value: 500, details: '', tag: '' }]}
                currencySymbol="€"
            />
        )
        // Net income = 2000 * 0.5 = 1000, expenses = 500, balance = +500
        expect(screen.getByText('+500 €')).toBeInTheDocument()
    })
})
