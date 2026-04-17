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
        giftIdeasData: { ideas: [] },
        setGiftIdeasData: vi.fn(),
        refreshGiftIdeasData: vi.fn().mockResolvedValue(undefined),
        blurFinances: false,
        toggleBlurFinances: vi.fn(),
        sidebarOrder: ['/', '/tam', '/nw', '/rp', '/recipes', '/budget', '/sp', '/ea', '/gift-ideas'],
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
        loadRpData: vi.fn(),
        saveRpItem: vi.fn(),
        deleteRpItem: vi.fn(),
        loadRecipesData: vi.fn().mockResolvedValue({ recipes: [] }),
        saveRecipe: vi.fn().mockResolvedValue({ recipes: [] }),
        deleteRecipe: vi.fn().mockResolvedValue({ recipes: [] }),
        loadGiftIdeasData: vi.fn().mockResolvedValue({ ideas: [] }),
        saveGiftIdea: vi.fn().mockResolvedValue({ ideas: [] }),
        deleteGiftIdea: vi.fn().mockResolvedValue({ ideas: [] }),
    },
}))

import { GiftIdeas } from './GiftIdeas'

function renderPage() {
    return render(
        <MemoryRouter>
            <GiftIdeas />
        </MemoryRouter>
    )
}

describe('GiftIdeas', () => {
    it('renders the page title', async () => {
        renderPage()
        await waitFor(() => {
            expect(screen.getByText('Gift Ideas')).toBeInTheDocument()
        })
    })

    it('renders the New Idea button', async () => {
        renderPage()
        await waitFor(() => {
            expect(screen.getByText('New Idea')).toBeInTheDocument()
        })
    })

    it('shows empty state message when no ideas exist', async () => {
        renderPage()
        await waitFor(() => {
            expect(screen.getByText('No gift ideas yet. Add your first one!')).toBeInTheDocument()
        })
    })

    it('renders the search input', async () => {
        renderPage()
        await waitFor(() => {
            expect(screen.getByPlaceholderText('Search gift ideas...')).toBeInTheDocument()
        })
    })
})
