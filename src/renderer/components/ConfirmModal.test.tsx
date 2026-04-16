import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ConfirmModal } from './ConfirmModal'

describe('ConfirmModal', () => {
    it('renders nothing when closed', () => {
        const { container } = render(
            <ConfirmModal
                isOpen={false}
                title="Test"
                message="Test message"
                onConfirm={vi.fn()}
                onCancel={vi.fn()}
            />
        )
        expect(container.innerHTML).toBe('')
    })

    it('renders title and message when open', () => {
        render(
            <ConfirmModal
                isOpen={true}
                title="Delete Item"
                message="Are you sure?"
                onConfirm={vi.fn()}
                onCancel={vi.fn()}
            />
        )
        expect(screen.getByText('Delete Item')).toBeInTheDocument()
        expect(screen.getByText('Are you sure?')).toBeInTheDocument()
    })

    it('renders default button labels', () => {
        render(
            <ConfirmModal
                isOpen={true}
                title="Test"
                message="Test"
                onConfirm={vi.fn()}
                onCancel={vi.fn()}
            />
        )
        expect(screen.getByText('Confirm')).toBeInTheDocument()
        expect(screen.getByText('Cancel')).toBeInTheDocument()
    })

    it('renders custom button labels', () => {
        render(
            <ConfirmModal
                isOpen={true}
                title="Test"
                message="Test"
                confirmLabel="Yes, delete"
                cancelLabel="No, keep"
                onConfirm={vi.fn()}
                onCancel={vi.fn()}
            />
        )
        expect(screen.getByText('Yes, delete')).toBeInTheDocument()
        expect(screen.getByText('No, keep')).toBeInTheDocument()
    })

    it('calls onConfirm when confirm button is clicked', async () => {
        const onConfirm = vi.fn()
        render(
            <ConfirmModal
                isOpen={true}
                title="Test"
                message="Test"
                onConfirm={onConfirm}
                onCancel={vi.fn()}
            />
        )
        await userEvent.click(screen.getByText('Confirm'))
        expect(onConfirm).toHaveBeenCalledOnce()
    })

    it('calls onCancel when cancel button is clicked', async () => {
        const onCancel = vi.fn()
        render(
            <ConfirmModal
                isOpen={true}
                title="Test"
                message="Test"
                onConfirm={vi.fn()}
                onCancel={onCancel}
            />
        )
        await userEvent.click(screen.getByText('Cancel'))
        expect(onCancel).toHaveBeenCalledOnce()
    })

    it('applies danger styling when danger prop is true', () => {
        render(
            <ConfirmModal
                isOpen={true}
                title="Delete"
                message="Danger zone"
                onConfirm={vi.fn()}
                onCancel={vi.fn()}
                danger
            />
        )
        const confirmButton = screen.getByText('Confirm')
        expect(confirmButton).toHaveClass('bg-error')
    })

    it('applies gold styling when danger is false', () => {
        render(
            <ConfirmModal
                isOpen={true}
                title="Save Changes"
                message="Normal action"
                onConfirm={vi.fn()}
                onCancel={vi.fn()}
            />
        )
        const confirmButton = screen.getByRole('button', { name: 'Confirm' })
        expect(confirmButton).toHaveClass('bg-nobleGold')
    })
})
