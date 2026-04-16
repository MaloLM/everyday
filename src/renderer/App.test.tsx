import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

vi.mock('./context', () => ({
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
    refreshRpData: vi.fn().mockResolvedValue(undefined),
    recipesData: { recipes: [] },
    setRecipesData: vi.fn(),
    refreshRecipesData: vi.fn().mockResolvedValue(undefined),
    sidebarOrder: ['/', '/tam', '/nw', '/rp', '/recipes', '/budget', '/sp', '/ea'],
    setSidebarOrder: vi.fn(),
    eaData: { imports: [] },
    setEaData: vi.fn(),
    refreshEaData: vi.fn().mockResolvedValue(undefined),
  }),
  AppProvider: ({ children }) => <>{children}</>,
}))

vi.mock('./api/electron', () => ({
  useIpcRenderer: () => ({
    sendRequestData: vi.fn(),
    sendWriteData: vi.fn().mockResolvedValue({ status: 'ok', message: [] }),
    onResponseData: vi.fn().mockReturnValue(vi.fn()),
    saveFormData: vi.fn(),
    loadNetWorthData: vi.fn().mockResolvedValue({ entries: [], currency: 'EUR' }),
    saveNetWorthEntry: vi.fn(),
    deleteNetWorthEntry: vi.fn(),
    loadRpData: vi.fn().mockResolvedValue({ items: [], currency: 'EUR' }),
    saveRpItem: vi.fn(),
    deleteRpItem: vi.fn(),
    loadRecipesData: vi.fn().mockResolvedValue({ recipes: [] }),
    saveRecipe: vi.fn(),
    deleteRecipe: vi.fn(),
    loadEaData: vi.fn().mockResolvedValue({ imports: [] }),
    saveEaImport: vi.fn(),
    deleteEaImport: vi.fn(),
    exportAllData: vi.fn().mockResolvedValue({}),
    importAllData: vi.fn().mockResolvedValue(undefined),
  }),
}))

import { TargetAllocationMaintenance } from './pages/TargetAllocationMaintenance'
import { NetWorthAssessment } from './pages/NetWorthAssessment'
import { RecurringPurchases } from './pages/RecurringPurchases'
import { Recipes } from './pages/Recipes'
import { NotFoundComponent } from './pages/NotFound'
import { Layout } from './components'

function renderWithRoute(route: string) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Layout>
        <Routes>
          <Route path="/" element={<TargetAllocationMaintenance />} />
          <Route path="/tam" element={<TargetAllocationMaintenance />} />
          <Route path="/nw" element={<NetWorthAssessment />} />
          <Route path="/rp" element={<RecurringPurchases />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="*" element={<NotFoundComponent />} />
        </Routes>
      </Layout>
    </MemoryRouter>
  )
}

describe('App routing', () => {
  it('renders TAM page on /', async () => {
    renderWithRoute('/')
    await waitFor(() => {
      expect(screen.getByText('Current Allocation')).toBeInTheDocument()
    })
  })

  it('renders TAM page on /tam', async () => {
    renderWithRoute('/tam')
    await waitFor(() => {
      expect(screen.getByText('Next Buy Estimation')).toBeInTheDocument()
    })
  })

  it('renders NW page on /nw', async () => {
    renderWithRoute('/nw')
    await waitFor(() => {
      expect(screen.getByText('Net Worth Evolution')).toBeInTheDocument()
    })
  })

  it('renders Recurring Purchases page on /rp', async () => {
    renderWithRoute('/rp')
    await waitFor(() => {
      const elements = screen.getAllByText('Recurring Purchases')
      expect(elements.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('renders Recipes page on /recipes', async () => {
    renderWithRoute('/recipes')
    await waitFor(() => {
      const elements = screen.getAllByText('Recipes')
      expect(elements.length).toBeGreaterThanOrEqual(1)
    })
  })

  it('renders NotFound on unknown routes', async () => {
    renderWithRoute('/unknown')
    expect(screen.getByText(/not found|404/i)).toBeInTheDocument()
  })

  it('renders Sidebar on all routes', () => {
    renderWithRoute('/tam')
    expect(screen.getByLabelText('Sidebar')).toBeInTheDocument()
  })
})
