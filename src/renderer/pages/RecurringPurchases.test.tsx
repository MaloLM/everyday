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
    loadRpData: vi.fn().mockResolvedValue({ items: [], currency: 'EUR' }),
    saveRpItem: vi.fn(),
    deleteRpItem: vi.fn(),
    loadRecipesData: vi.fn().mockResolvedValue({ recipes: [] }),
    saveRecipe: vi.fn(),
    deleteRecipe: vi.fn(),
  },
}))

import { RecurringPurchases } from './RecurringPurchases'

function renderPage() {
  return render(
    <MemoryRouter>
      <RecurringPurchases />
    </MemoryRouter>
  )
}

describe('RecurringPurchases', () => {
  it('renders the page title', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Recurring Purchases')).toBeInTheDocument()
    })
  })

  it('renders the Annual Summary card', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Annual Summary')).toBeInTheDocument()
    })
  })

  it('renders the Purchases card', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Purchases')).toBeInTheDocument()
    })
  })

  it('shows Add Purchase button', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Purchase')).toBeInTheDocument()
    })
  })

  it('shows Save button', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTitle('Save purchases')).toBeInTheDocument()
    })
  })
})
