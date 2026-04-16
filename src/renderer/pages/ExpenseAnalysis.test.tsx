import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('../context', () => ({
    useAppContext: vi.fn().mockReturnValue({
        eaData: {
            imports: [
                {
                    id: 'imp-1',
                    title: 'January Import',
                    date: '2026-01-15T00:00:00.000Z',
                    bankSource: 'revolut',
                    transactions: [
                        { id: 't1', type: 'CARD_PAYMENT', description: 'Shop', amount: -25, fee: 0, currency: 'EUR', tag: '', flagged: false },
                    ],
                },
            ],
        },
        refreshEaData: vi.fn().mockResolvedValue(undefined),
    }),
}))

vi.mock('../api/electron', () => ({
    useIpcRenderer: () => ({
        saveEaImport: vi.fn().mockResolvedValue({}),
        deleteEaImport: vi.fn().mockResolvedValue({}),
    }),
}))

vi.mock('../components/DonutChart', () => ({
    DonutChart: () => <div data-testid="donut-chart" />,
}))

import { ExpenseAnalysis } from './ExpenseAnalysis'

function renderPage(route = '/ea') {
    return render(
        <MemoryRouter initialEntries={[route]}>
            <Routes>
                <Route path="/ea" element={<ExpenseAnalysis />} />
                <Route path="/ea/:importId" element={<ExpenseAnalysis />} />
            </Routes>
        </MemoryRouter>
    )
}

describe('ExpenseAnalysis', () => {
    it('renders the list view when no importId', async () => {
        renderPage('/ea')
        await waitFor(() => {
            expect(screen.getByText('Expense Analysis')).toBeInTheDocument()
        })
    })

    it('renders import cards in list view', async () => {
        renderPage('/ea')
        await waitFor(() => {
            expect(screen.getByText('January Import')).toBeInTheDocument()
        })
    })

    it('renders the detail view when importId matches', async () => {
        renderPage('/ea/imp-1')
        await waitFor(() => {
            expect(screen.getByDisplayValue('January Import')).toBeInTheDocument()
        })
    })

    it('renders not found when importId does not match', async () => {
        renderPage('/ea/non-existent')
        await waitFor(() => {
            expect(screen.getByText('Import not found')).toBeInTheDocument()
        })
    })

    it('shows New Import button in list view', async () => {
        renderPage('/ea')
        await waitFor(() => {
            expect(screen.getByText('New Import')).toBeInTheDocument()
        })
    })
})
