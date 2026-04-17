import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { AppProvider, useAppContext } from './index'

vi.mock('../api/electron', () => ({
  ipc: {
    requestData: vi.fn(),
    onResponseData: vi.fn().mockReturnValue(vi.fn()),
    loadNetWorthData: vi.fn().mockResolvedValue({ entries: [], currency: 'EUR' }),
    sendData: vi.fn(),
    saveTAMForm: vi.fn(),
    saveNetWorthEntry: vi.fn(),
    deleteNetWorthEntry: vi.fn(),
    loadRpData: vi.fn().mockResolvedValue({ items: [], currency: 'EUR' }),
    saveRpItem: vi.fn(),
    deleteRpItem: vi.fn(),
    loadRecipesData: vi.fn().mockResolvedValue({ recipes: [] }),
    saveRecipe: vi.fn(),
    deleteRecipe: vi.fn(),
    loadBudgetData: vi.fn().mockResolvedValue({ expenses: [], incomes: [], currency: 'EUR' }),
    saveBudgetData: vi.fn(),
    loadSavingsProjectsData: vi.fn().mockResolvedValue({ projects: [], currency: 'EUR' }),
    saveSavingsProjectsData: vi.fn(),
    loadEaData: vi.fn().mockResolvedValue({ imports: [] }),
    saveEaImport: vi.fn(),
    deleteEaImport: vi.fn(),
    loadGiftIdeasData: vi.fn().mockResolvedValue({ ideas: [] }),
    saveGiftIdea: vi.fn(),
    deleteGiftIdea: vi.fn(),
    exportAllData: vi.fn().mockResolvedValue({}),
    importAllData: vi.fn().mockResolvedValue(undefined),
  },
}))

function TestConsumer() {
  const { tamData, nwData, eaData } = useAppContext()
  return (
    <div>
      <span data-testid="tam-budget">{tamData?.budget ?? 'loading'}</span>
      <span data-testid="nw-currency">{nwData?.currency ?? 'loading'}</span>
      <span data-testid="ea-imports">{eaData?.imports?.length ?? 'loading'}</span>
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

  it('provides default eaData with empty imports', async () => {
    render(
      <AppProvider>
        <TestConsumer />
      </AppProvider>
    )
    await waitFor(() => {
      expect(screen.getByTestId('ea-imports')).toHaveTextContent('0')
    })
  })
})
