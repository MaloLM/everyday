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
        spData: { projects: [], currency: 'EUR' },
        setSpData: vi.fn(),
        refreshSpData: vi.fn().mockResolvedValue(undefined),
        blurFinances: false,
        toggleBlurFinances: vi.fn(),
        sidebarOrder: ['/', '/tam', '/nw', '/rp', '/recipes', '/budget', '/sp'],
        setSidebarOrder: vi.fn(),
    }),
}))

vi.mock('../api/electron', () => ({
    ipc: {
        requestData: vi.fn(),
        sendData: vi.fn(),
        onResponseData: vi.fn().mockReturnValue(vi.fn()),
        saveTAMForm: vi.fn(),
        loadNetWorthData: vi.fn(),
        saveNetWorthEntry: vi.fn(),
        deleteNetWorthEntry: vi.fn(),
        loadRpData: vi.fn().mockResolvedValue({ items: [], currency: 'EUR' }),
        saveRpItem: vi.fn(),
        deleteRpItem: vi.fn(),
        loadBudgetData: vi.fn().mockResolvedValue({ expenses: [], incomes: [], currency: 'EUR' }),
        saveBudgetData: vi.fn().mockResolvedValue({ expenses: [], incomes: [], currency: 'EUR' }),
        loadSavingsProjectsData: vi.fn().mockResolvedValue({ projects: [], currency: 'EUR' }),
        saveSavingsProjectsData: vi.fn().mockResolvedValue({ projects: [], currency: 'EUR' }),
        loadRecipesData: vi.fn().mockResolvedValue({ recipes: [] }),
        saveRecipe: vi.fn(),
        deleteRecipe: vi.fn(),
        exportAllData: vi.fn().mockResolvedValue({}),
        importAllData: vi.fn().mockResolvedValue(undefined),
    },
}))

import { SavingsProjects } from './SavingsProjects'

function renderPage() {
    return render(
        <MemoryRouter>
            <SavingsProjects />
        </MemoryRouter>
    )
}

describe('SavingsProjects', () => {
    it('renders the page title', async () => {
        renderPage()
        await waitFor(() => {
            expect(screen.getByText('Savings Projects')).toBeInTheDocument()
        })
    })

    it('renders the Overview card', async () => {
        renderPage()
        await waitFor(() => {
            expect(screen.getByText('Overview')).toBeInTheDocument()
        })
    })

    it('renders the Projects card', async () => {
        renderPage()
        await waitFor(() => {
            expect(screen.getByText('Projects')).toBeInTheDocument()
        })
    })

    it('shows Save button', async () => {
        renderPage()
        await waitFor(() => {
            expect(screen.getByTitle('Save savings projects')).toBeInTheDocument()
        })
    })

    it('shows empty state message when no projects', async () => {
        renderPage()
        await waitFor(() => {
            expect(screen.getByText('No savings projects yet.')).toBeInTheDocument()
        })
    })
})
