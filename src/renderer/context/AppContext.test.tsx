import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AppProvider, useAppContext } from './index'

vi.mock('../api/electron', () => ({
  useIpcRenderer: () => ({
    sendRequestData: vi.fn(),
    onResponseData: vi.fn().mockReturnValue(vi.fn()),
    loadNetWorthData: vi.fn().mockResolvedValue({ entries: [], currency: 'EUR' }),
    sendWriteData: vi.fn(),
    saveFormData: vi.fn(),
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

function TestConsumer() {
  const { tamData, nwData } = useAppContext()
  return (
    <div>
      <span data-testid="tam-budget">{tamData?.budget ?? 'loading'}</span>
      <span data-testid="nw-currency">{nwData?.currency ?? 'loading'}</span>
    </div>
  )
}

describe('AppContext', () => {
  it('provides default nwData with EUR currency', async () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('nw-currency')).toHaveTextContent('EUR')
    })
  })

  it('provides tamData (initially empty)', () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    )
    expect(screen.getByTestId('tam-budget')).toHaveTextContent('loading')
  })
})
