import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BudgetExpenseList } from './BudgetExpenseList'
import { renderWithFormik } from '../../../../test/helpers'

describe('BudgetExpenseList', () => {
    const defaultValues = {
        expenses: [
            { id: '1', label: 'Rent', value: 1200, details: 'Monthly', tag: 'Housing' },
        ],
        currency: 'EUR',
    }

    it('renders expense items', () => {
        renderWithFormik(
            <BudgetExpenseList values={defaultValues} errors={{}} setFieldValue={vi.fn()} />,
            { initialValues: { expenses: defaultValues.expenses } }
        )
        expect(screen.getByDisplayValue('Rent')).toBeInTheDocument()
    })

    it('shows empty message when no expenses', () => {
        renderWithFormik(
            <BudgetExpenseList values={{ expenses: [], currency: 'EUR' }} errors={{}} setFieldValue={vi.fn()} />,
            { initialValues: { expenses: [] } }
        )
        expect(screen.getByText('No expenses added')).toBeInTheDocument()
    })

    it('calls setFieldValue when adding an expense', async () => {
        const setFieldValue = vi.fn()
        renderWithFormik(
            <BudgetExpenseList values={{ expenses: [], currency: 'EUR' }} errors={{}} setFieldValue={setFieldValue} />,
            { initialValues: { expenses: [] } }
        )
        await userEvent.click(screen.getByText('Expense'))
        expect(setFieldValue).toHaveBeenCalledWith('expenses', expect.arrayContaining([
            expect.objectContaining({ label: '', value: 0 }),
        ]))
    })

    it('calls setFieldValue when deleting an expense', async () => {
        const setFieldValue = vi.fn()
        renderWithFormik(
            <BudgetExpenseList values={defaultValues} errors={{}} setFieldValue={setFieldValue} />,
            { initialValues: { expenses: defaultValues.expenses } }
        )
        const deleteButton = screen.getByRole('button', { name: '' })
        await userEvent.click(deleteButton)
        expect(setFieldValue).toHaveBeenCalledWith('expenses', [])
    })
})
