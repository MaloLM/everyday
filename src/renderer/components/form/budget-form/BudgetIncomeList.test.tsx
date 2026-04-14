import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BudgetIncomeList } from './BudgetIncomeList'
import { renderWithFormik } from '../../../../test/helpers'

describe('BudgetIncomeList', () => {
    const defaultValues = {
        incomes: [
            { id: '1', label: 'Salary', value: 3000, deductionRate: 25, tag: 'Job' },
        ],
        currency: 'EUR',
    }

    it('renders income items', () => {
        renderWithFormik(
            <BudgetIncomeList values={defaultValues} errors={{}} setFieldValue={vi.fn()} />,
            { initialValues: { incomes: defaultValues.incomes } }
        )
        expect(screen.getByDisplayValue('Salary')).toBeInTheDocument()
    })

    it('shows empty message when no income', () => {
        renderWithFormik(
            <BudgetIncomeList values={{ incomes: [], currency: 'EUR' }} errors={{}} setFieldValue={vi.fn()} />,
            { initialValues: { incomes: [] } }
        )
        expect(screen.getByText('No income added')).toBeInTheDocument()
    })

    it('calls setFieldValue when adding income', async () => {
        const setFieldValue = vi.fn()
        renderWithFormik(
            <BudgetIncomeList values={{ incomes: [], currency: 'EUR' }} errors={{}} setFieldValue={setFieldValue} />,
            { initialValues: { incomes: [] } }
        )
        await userEvent.click(screen.getByText('Income'))
        expect(setFieldValue).toHaveBeenCalledWith('incomes', expect.arrayContaining([
            expect.objectContaining({ label: '', value: 0, deductionRate: 0 }),
        ]))
    })

    it('calls setFieldValue when deleting income', async () => {
        const setFieldValue = vi.fn()
        renderWithFormik(
            <BudgetIncomeList values={defaultValues} errors={{}} setFieldValue={setFieldValue} />,
            { initialValues: { incomes: defaultValues.incomes } }
        )
        const deleteButton = screen.getByRole('button', { name: '' })
        await userEvent.click(deleteButton)
        expect(setFieldValue).toHaveBeenCalledWith('incomes', [])
    })
})
