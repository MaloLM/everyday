import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

const mockExportAllData = vi.fn()
const mockImportAllData = vi.fn()
const mockSendRequestData = vi.fn()
const mockRefreshNwData = vi.fn()
const mockRefreshRpData = vi.fn()
const mockRefreshRecipesData = vi.fn()
const mockRefreshBudgetData = vi.fn()
const mockRefreshSpData = vi.fn()

vi.mock('../api/electron', () => ({
    useIpcRenderer: () => ({
        exportAllData: mockExportAllData,
        importAllData: mockImportAllData,
        sendRequestData: mockSendRequestData,
    }),
}))

vi.mock('../context', () => ({
    useAppContext: () => ({
        refreshNwData: mockRefreshNwData,
        refreshRpData: mockRefreshRpData,
        refreshRecipesData: mockRefreshRecipesData,
        refreshBudgetData: mockRefreshBudgetData,
        refreshSpData: mockRefreshSpData,
    }),
}))

vi.mock('react-hot-toast', () => ({
    default: { success: vi.fn(), error: vi.fn() },
}))

import toast from 'react-hot-toast'
import { Home } from './Home'

function renderPage() {
    return render(
        <MemoryRouter>
            <Home />
        </MemoryRouter>
    )
}

describe('Home', () => {
    beforeEach(() => {
        mockExportAllData.mockResolvedValue({
            exportedAt: '2026-04-12T00:00:00.000Z',
            tam: {},
            netWorth: {},
            recurringPurchases: {},
            recipes: {},
        })
        mockImportAllData.mockResolvedValue(undefined)
        mockRefreshNwData.mockResolvedValue(undefined)
        mockRefreshRpData.mockResolvedValue(undefined)
        mockRefreshRecipesData.mockResolvedValue(undefined)
        mockRefreshBudgetData.mockResolvedValue(undefined)
        mockRefreshSpData.mockResolvedValue(undefined)
    })

    it('renders the page title', () => {
        renderPage()
        expect(screen.getByText('Everyday')).toBeInTheDocument()
    })

    it('renders the subtitle', () => {
        renderPage()
        expect(screen.getByText('Your everyday personal toolkit')).toBeInTheDocument()
    })

    it('renders the export button', () => {
        renderPage()
        expect(screen.getByTitle('Export all data')).toBeInTheDocument()
    })

    it('renders the import button', () => {
        renderPage()
        expect(screen.getByTitle('Import data')).toBeInTheDocument()
    })

    it('renders all feature cards', () => {
        renderPage()
        expect(screen.getByText('Target Allocation')).toBeInTheDocument()
        expect(screen.getByText('Net Worth')).toBeInTheDocument()
        expect(screen.getByText('Recurring Purchases')).toBeInTheDocument()
        expect(screen.getByText('Recipes')).toBeInTheDocument()
    })

    it('calls exportAllData on click', async () => {
        renderPage()
        const user = userEvent.setup()

        await user.click(screen.getByTitle('Export all data'))

        await waitFor(() => {
            expect(mockExportAllData).toHaveBeenCalledOnce()
        })
    })

    it('triggers download with correct filename', async () => {
        const createObjectURL = vi.fn().mockReturnValue('blob:test')
        const revokeObjectURL = vi.fn()
        globalThis.URL.createObjectURL = createObjectURL
        globalThis.URL.revokeObjectURL = revokeObjectURL

        const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
        const appendChildSpy = vi.spyOn(document.body, 'appendChild')

        renderPage()
        const user = userEvent.setup()
        await user.click(screen.getByTitle('Export all data'))

        await waitFor(() => {
            expect(clickSpy).toHaveBeenCalled()
        })

        const anchor = appendChildSpy.mock.calls.find(
            ([node]) => node instanceof HTMLAnchorElement
        )?.[0] as HTMLAnchorElement
        expect(anchor.download).toMatch(/^everyday-export-\d{4}-\d{2}-\d{2}\.json$/)
        expect(createObjectURL).toHaveBeenCalled()
        expect(revokeObjectURL).toHaveBeenCalled()

        vi.restoreAllMocks()
    })

    it('imports data from a JSON file and refreshes context', async () => {
        renderPage()
        const user = userEvent.setup()

        const importData = { tam: { assets: [] }, netWorth: {}, recurringPurchases: {}, recipes: {} }
        const file = new File([JSON.stringify(importData)], 'backup.json', { type: 'application/json' })

        const input = screen.getByTestId('import-file-input')
        await user.upload(input, file)

        await waitFor(() => {
            expect(mockImportAllData).toHaveBeenCalledWith(importData)
        })
        expect(mockSendRequestData).toHaveBeenCalled()
        expect(mockRefreshNwData).toHaveBeenCalled()
        expect(mockRefreshRpData).toHaveBeenCalled()
        expect(mockRefreshRecipesData).toHaveBeenCalled()
        expect(toast.success).toHaveBeenCalledWith('Data imported successfully')
    })

    it('shows error toast on invalid JSON import', async () => {
        renderPage()
        const user = userEvent.setup()

        const file = new File(['not valid json'], 'bad.json', { type: 'application/json' })

        const input = screen.getByTestId('import-file-input')
        await user.upload(input, file)

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Failed to import data')
        })
        expect(mockImportAllData).not.toHaveBeenCalled()
    })
})
