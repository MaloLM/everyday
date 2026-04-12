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
  }),
}))

import { TargetAllocationMaintenance } from './pages/TargetAllocationMaintenance'
import { NetWorthAssessment } from './pages/NetWorthAssessment'
import { OtherFeature } from './pages/OtherFeature'
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
          <Route path="/other-feature" element={<OtherFeature />} />
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

  it('renders Other Feature page on /other-feature', async () => {
    renderWithRoute('/other-feature')
    // Both sidebar and page have "Other Feature" text, so use getAllByText
    const elements = screen.getAllByText('Other Feature')
    expect(elements.length).toBeGreaterThanOrEqual(2) // sidebar + page heading
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
