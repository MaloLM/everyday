import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { EaImport } from '../../utils/types'

vi.mock('../DonutChart', () => ({
    DonutChart: () => <div data-testid="donut-chart" />,
}))

import { EaImportDetail } from './EaImportDetail'

const mockImport: EaImport = {
    id: 'imp-1',
    title: 'Test Import',
    date: '2026-01-15T00:00:00.000Z',
    bankSource: 'revolut',
    transactions: [
        { id: 't1', type: 'CARD_PAYMENT', description: 'Shop A', amount: -25, fee: 0, currency: 'EUR', tag: 'Food', flagged: false },
        { id: 't2', type: 'TRANSFER', description: 'Rent', amount: -800, fee: -1, currency: 'EUR', tag: '', flagged: true },
    ],
}

function renderDetail(props?: Partial<{ onSave: any; onDelete: any }>) {
    return render(
        <MemoryRouter>
            <EaImportDetail
                importData={mockImport}
                onSave={props?.onSave ?? vi.fn().mockResolvedValue(undefined)}
                onDelete={props?.onDelete ?? vi.fn().mockResolvedValue(undefined)}
            />
        </MemoryRouter>
    )
}

describe('EaImportDetail', () => {
    it('renders the import title', () => {
        renderDetail()
        expect(screen.getByDisplayValue('Test Import')).toBeInTheDocument()
    })

    it('renders back button', () => {
        renderDetail()
        expect(screen.getByTitle('Back to imports')).toBeInTheDocument()
    })

    it('renders delete button', () => {
        renderDetail()
        expect(screen.getByTitle('Delete import')).toBeInTheDocument()
    })

    it('renders save button', () => {
        renderDetail()
        expect(screen.getByTitle('Save import')).toBeInTheDocument()
    })

    it('renders transaction descriptions', () => {
        renderDetail()
        expect(screen.getByText('Shop A')).toBeInTheDocument()
        expect(screen.getByText('Rent')).toBeInTheDocument()
    })

    it('renders the donut chart', () => {
        renderDetail()
        expect(screen.getByTestId('donut-chart')).toBeInTheDocument()
    })

    it('opens confirm modal on delete click', async () => {
        renderDetail()
        await userEvent.click(screen.getByTitle('Delete import'))
        expect(screen.getByText('Delete Import')).toBeInTheDocument()
        expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument()
    })

    it('renders flagged row styling', () => {
        renderDetail()
        const rentRow = screen.getByText('Rent').closest('tr')
        expect(rentRow).toHaveClass('bg-error/10')
    })
})
