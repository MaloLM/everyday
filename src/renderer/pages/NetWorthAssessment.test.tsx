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
    refreshRpData: vi.fn(),
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
    saveNetWorthEntry: vi.fn().mockResolvedValue({ entries: [], currency: 'EUR' }),
    deleteNetWorthEntry: vi.fn().mockResolvedValue({ entries: [], currency: 'EUR' }),
    loadRpData: vi.fn().mockResolvedValue({ items: [], currency: 'EUR' }),
    saveRpItem: vi.fn(),
    deleteRpItem: vi.fn(),
    loadRecipesData: vi.fn().mockResolvedValue({ recipes: [] }),
    saveRecipe: vi.fn(),
    deleteRecipe: vi.fn(),
  },
}))

import { NetWorthAssessment } from './NetWorthAssessment'

function renderPage() {
  return render(
    <MemoryRouter>
      <NetWorthAssessment />
    </MemoryRouter>
  )
}

describe('NetWorthAssessment', () => {
  it('renders the page title', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Net Worth Assessment')).toBeInTheDocument()
    })
  })

  it('renders NwForm when data is loaded', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Net Worth Evolution')).toBeInTheDocument()
    })
  })

  it('renders the Audit Entry card', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Audit Entry')).toBeInTheDocument()
    })
  })

  it('shows New Audit button', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('New Audit')).toBeInTheDocument()
    })
  })

  it('shows Save button for entry form', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Save')).toBeInTheDocument()
    })
  })
})
