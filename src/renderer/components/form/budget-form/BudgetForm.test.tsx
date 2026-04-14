import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BudgetData } from '../../../utils'

vi.mock('../../DonutChart', () => ({
    DonutChart: () => <div data-testid="donut-chart" />,
}))

import { BudgetForm } from './BudgetForm'

const emptyData: BudgetData = { expenses: [], incomes: [], currency: 'EUR' }

const populatedData: BudgetData = {
    expenses: [
        { id: '1', label: 'Rent', value: 1200, details: 'Monthly rent', tag: 'Housing' },
        { id: '2', label: 'Food', value: 400, details: '', tag: 'Living' },
    ],
    incomes: [
        { id: '3', label: 'Salary', value: 3000, deductionRate: 25, tag: 'Job' },
    ],
    currency: 'EUR',
}

describe('BudgetForm', () => {
    it('renders the summary card', () => {
        render(<BudgetForm budgetData={emptyData} onSave={vi.fn()} />)
        expect(screen.getByText('Monthly Summary')).toBeInTheDocument()
    })

    it('renders income and expenses cards', () => {
        render(<BudgetForm budgetData={emptyData} onSave={vi.fn()} />)
        expect(screen.getAllByText('Income').length).toBeGreaterThanOrEqual(1)
        expect(screen.getAllByText('Expenses').length).toBeGreaterThanOrEqual(1)
    })

    it('renders charts card', () => {
        render(<BudgetForm budgetData={emptyData} onSave={vi.fn()} />)
        expect(screen.getByText('Charts')).toBeInTheDocument()
    })

    it('shows Save button', () => {
        render(<BudgetForm budgetData={emptyData} onSave={vi.fn()} />)
        expect(screen.getByText('Save')).toBeInTheDocument()
    })

    it('shows empty messages when no data', () => {
        render(<BudgetForm budgetData={emptyData} onSave={vi.fn()} />)
        expect(screen.getByText('No expenses added')).toBeInTheDocument()
        expect(screen.getByText('No income added')).toBeInTheDocument()
    })

    it('renders populated data', () => {
        render(<BudgetForm budgetData={populatedData} onSave={vi.fn()} />)
        expect(screen.getByDisplayValue('Rent')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Salary')).toBeInTheDocument()
    })

    it('displays tag filter when items have tags', () => {
        render(<BudgetForm budgetData={populatedData} onSave={vi.fn()} />)
        expect(screen.getAllByText('Housing').length).toBeGreaterThanOrEqual(1)
        expect(screen.getAllByText('Job').length).toBeGreaterThanOrEqual(1)
        expect(screen.getByText('All')).toBeInTheDocument()
    })

    it('calls onSave when form is submitted', async () => {
        const onSave = vi.fn().mockResolvedValue(undefined)
        render(<BudgetForm budgetData={emptyData} onSave={onSave} />)
        const saveButton = screen.getByText('Save')
        await userEvent.click(saveButton)
        await waitFor(() => {
            expect(onSave).toHaveBeenCalled()
        })
    })
})
