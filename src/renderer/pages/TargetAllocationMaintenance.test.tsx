import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('../context', () => ({
  useAppContext: vi.fn().mockReturnValue({
    tamData: {
      assets: [{ id: '1', assetName: 'BTC', unitPrice: 100, quantityOwned: 2, targetPercent: 100 }],
      budget: 10000,
      currency: 'EUR',
    },
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
  }),
}))

vi.mock('../api/electron', () => ({
  useIpcRenderer: () => ({
    sendRequestData: vi.fn(),
    sendWriteData: vi.fn().mockResolvedValue({ status: 'ok', message: [] }),
    onResponseData: vi.fn().mockReturnValue(vi.fn()),
    saveFormData: vi.fn(),
    loadNetWorthData: vi.fn(),
    saveNetWorthEntry: vi.fn(),
    deleteNetWorthEntry: vi.fn(),
    loadRpData: vi.fn().mockResolvedValue({ items: [], currency: 'EUR' }),
    saveRpItem: vi.fn(),
    deleteRpItem: vi.fn(),
    loadRecipesData: vi.fn().mockResolvedValue({ recipes: [] }),
    saveRecipe: vi.fn(),
    deleteRecipe: vi.fn(),
  }),
}))

import { TargetAllocationMaintenance } from './TargetAllocationMaintenance'

function renderPage() {
  return render(
    <MemoryRouter>
      <TargetAllocationMaintenance />
    </MemoryRouter>
  )
}

describe('TargetAllocationMaintenance', () => {
  it('renders the page title', () => {
    renderPage()
    expect(screen.getByText('Target Allocation Maintenance')).toBeInTheDocument()
  })

  it('renders TamForm when data is loaded', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Current Allocation')).toBeInTheDocument()
    })
  })

  it('renders the Next Buy Estimation card', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Next Buy Estimation')).toBeInTheDocument()
    })
  })

  it('shows budget field', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByText('Budget')).toBeInTheDocument()
    })
  })
})
