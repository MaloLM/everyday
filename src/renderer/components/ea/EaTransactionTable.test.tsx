import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { EaTransactionTable } from './EaTransactionTable'
import { EaTransaction } from '../../utils/types'

const transactions: EaTransaction[] = [
    { id: 't1', type: 'CARD_PAYMENT', description: 'Supermarket', amount: -42.50, fee: 0, currency: 'EUR', tag: 'Food', flagged: false },
    { id: 't2', type: 'TRANSFER', description: 'Rent Payment', amount: -800, fee: -1, currency: 'EUR', tag: '', flagged: true },
]

describe('EaTransactionTable', () => {
    it('renders all transaction rows', () => {
        render(
            <EaTransactionTable
                transactions={transactions}
                allTags={['Food']}
                onUpdateTransaction={vi.fn()}
                onToggleFlag={vi.fn()}
            />
        )
        expect(screen.getByDisplayValue('Supermarket')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Rent Payment')).toBeInTheDocument()
    })

    it('renders flagged row with error background', () => {
        render(
            <EaTransactionTable
                transactions={transactions}
                allTags={['Food']}
                onUpdateTransaction={vi.fn()}
                onToggleFlag={vi.fn()}
            />
        )
        const flaggedRow = screen.getByDisplayValue('Rent Payment').closest('tr')
        expect(flaggedRow).toHaveClass('bg-error/10')
    })

    it('renders unflagged row without error background', () => {
        render(
            <EaTransactionTable
                transactions={transactions}
                allTags={['Food']}
                onUpdateTransaction={vi.fn()}
                onToggleFlag={vi.fn()}
            />
        )
        const unflaggedRow = screen.getByDisplayValue('Supermarket').closest('tr')
        expect(unflaggedRow).not.toHaveClass('bg-error/10')
    })

    it('calls onToggleFlag when flag button is clicked', async () => {
        const onToggleFlag = vi.fn()
        render(
            <EaTransactionTable
                transactions={transactions}
                allTags={['Food']}
                onUpdateTransaction={vi.fn()}
                onToggleFlag={onToggleFlag}
            />
        )
        const flagButtons = screen.getAllByTitle(/flag/i)
        await userEvent.click(flagButtons[0])
        expect(onToggleFlag).toHaveBeenCalledWith(0)
    })

    it('calls onUpdateTransaction when tag is changed', async () => {
        const onUpdateTransaction = vi.fn()
        render(
            <EaTransactionTable
                transactions={transactions}
                allTags={['Food']}
                onUpdateTransaction={onUpdateTransaction}
                onToggleFlag={vi.fn()}
            />
        )
        const tagInputs = screen.getAllByPlaceholderText('tag')
        await userEvent.type(tagInputs[1], 'Housing')
        expect(onUpdateTransaction).toHaveBeenCalled()
    })

    it('shows empty message when no transactions', () => {
        render(
            <EaTransactionTable
                transactions={[]}
                allTags={[]}
                onUpdateTransaction={vi.fn()}
                onToggleFlag={vi.fn()}
            />
        )
        expect(screen.getByText('No transactions')).toBeInTheDocument()
    })

    it('renders amounts with 2 decimal places', () => {
        render(
            <EaTransactionTable
                transactions={transactions}
                allTags={['Food']}
                onUpdateTransaction={vi.fn()}
                onToggleFlag={vi.fn()}
            />
        )
        expect(screen.getByText('-42.50')).toBeInTheDocument()
    })

    it('renders editable description fields', () => {
        render(
            <EaTransactionTable
                transactions={transactions}
                allTags={['Food']}
                onUpdateTransaction={vi.fn()}
                onToggleFlag={vi.fn()}
            />
        )
        expect(screen.getByDisplayValue('Supermarket')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Rent Payment')).toBeInTheDocument()
    })

    it('calls onUpdateTransaction when description is changed', async () => {
        const onUpdateTransaction = vi.fn()
        render(
            <EaTransactionTable
                transactions={transactions}
                allTags={['Food']}
                onUpdateTransaction={onUpdateTransaction}
                onToggleFlag={vi.fn()}
            />
        )
        const descInput = screen.getByDisplayValue('Supermarket')
        await userEvent.type(descInput, '!')
        expect(onUpdateTransaction).toHaveBeenCalledWith(0, 'description', 'Supermarket!')
    })
})
