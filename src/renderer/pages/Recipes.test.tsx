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
    blurFinances: false,
    toggleBlurFinances: vi.fn(),
    sidebarOrder: ['/', '/tam', '/nw', '/rp', '/recipes', '/budget'],
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
  },
}))

import { Recipes } from './Recipes'

function renderPage() {
  return render(
    <MemoryRouter>
      <Recipes />
    </MemoryRouter>
  )
}

describe('Recipes', () => {
  it('renders the page title', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Recipes')).toBeInTheDocument()
    })
  })

  it('renders the New Recipe button', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('New Recipe')).toBeInTheDocument()
    })
  })

  it('shows empty state message when no recipes exist', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('No recipes yet. Create your first one!')).toBeInTheDocument()
    })
  })

  it('renders the search input', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Search recipes...')).toBeInTheDocument()
    })
  })
})
