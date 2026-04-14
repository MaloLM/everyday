import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../context', () => ({
    useAppContext: vi.fn().mockReturnValue({
        tamData: {},
        setTamData: vi.fn(),
        nwData: { entries: [], currency: 'EUR' },
        setNwData: vi.fn(),
        refreshNwData: vi.fn(),
        rpData: { items: [], currency: 'EUR' },
        setRpData: vi.fn(),
        refreshRpData: vi.fn().mockResolvedValue(undefined),
        recipesData: { recipes: [] },
        setRecipesData: vi.fn(),
        refreshRecipesData: vi.fn().mockResolvedValue(undefined),
        budgetData: { expenses: [], incomes: [], currency: 'EUR' },
        setBudgetData: vi.fn(),
        refreshBudgetData: vi.fn().mockResolvedValue(undefined),
        blurFinances: false,
        toggleBlurFinances: vi.fn(),
        sidebarOrder: ['/', '/tam', '/nw', '/rp', '/recipes', '/budget'],
        setSidebarOrder: vi.fn(),
    }),
}))

vi.mock('../api/electron', () => ({
    useIpcRenderer: () => ({
        sendRequestData: vi.fn(),
        sendWriteData: vi.fn(),
        onResponseData: vi.fn().mockReturnValue(vi.fn()),
        saveFormData: vi.fn(),
        loadNetWorthData: vi.fn(),
        saveNetWorthEntry: vi.fn(),
        deleteNetWorthEntry: vi.fn(),
        loadRpData: vi.fn().mockResolvedValue({ items: [], currency: 'EUR' }),
        saveRpItem: vi.fn(),
        deleteRpItem: vi.fn(),
        loadBudgetData: vi.fn().mockResolvedValue({ expenses: [], incomes: [], currency: 'EUR' }),
        saveBudgetData: vi.fn().mockResolvedValue({ expenses: [], incomes: [], currency: 'EUR' }),
        loadRecipesData: vi.fn().mockResolvedValue({ recipes: [] }),
        saveRecipe: vi.fn(),
        deleteRecipe: vi.fn(),
        exportAllData: vi.fn().mockResolvedValue({}),
        importAllData: vi.fn().mockResolvedValue(undefined),
    }),
}))

import { Budgeting } from './Budgeting'

function renderPage() {
    return render(
        <MemoryRouter>
            <Budgeting />
        </MemoryRouter>
    )
}

describe('Budgeting', () => {
    it('renders the page title', async () => {
        renderPage()
        await waitFor(() => {
            expect(screen.getByText('Budgeting')).toBeInTheDocument()
        })
    })

    it('renders the Monthly Summary card', async () => {
        renderPage()
        await waitFor(() => {
            expect(screen.getByText('Monthly Summary')).toBeInTheDocument()
        })
    })

    it('renders the Income card', async () => {
        renderPage()
        await waitFor(() => {
            expect(screen.getAllByText('Income').length).toBeGreaterThanOrEqual(1)
        })
    })

    it('renders the Expenses card', async () => {
        renderPage()
        await waitFor(() => {
            expect(screen.getAllByText('Expenses').length).toBeGreaterThanOrEqual(1)
        })
    })

    it('shows Save button', async () => {
        renderPage()
        await waitFor(() => {
            expect(screen.getByTitle('Save budget')).toBeInTheDocument()
        })
    })
})
