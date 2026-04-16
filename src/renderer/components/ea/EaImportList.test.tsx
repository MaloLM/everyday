import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { EaImport } from '../../utils/types'

vi.mock('react-chartjs-2', () => ({
    Doughnut: () => <div data-testid="donut-chart" />,
}))

vi.mock('react-hot-toast', () => ({
    default: { success: vi.fn(), error: vi.fn() },
}))

import toast from 'react-hot-toast'
import { EaImportList } from './EaImportList'

const mockImports: EaImport[] = [
    {
        id: 'imp-1',
        title: 'January Import',
        date: '2026-01-15T00:00:00.000Z',
        bankSource: 'revolut',
        transactions: [
            { id: 't1', type: 'CARD_PAYMENT', description: 'Shop', amount: -25, fee: 0, currency: 'EUR', tag: 'Food', flagged: false },
        ],
    },
]

const defaultProps = {
    imports: mockImports,
    allKnownTags: ['Food'],
    onSaveImport: vi.fn().mockResolvedValue(undefined),
    onSaveTags: vi.fn().mockResolvedValue(undefined),
    onRefresh: vi.fn().mockResolvedValue(undefined),
}

function renderList(props?: Partial<typeof defaultProps>) {
    return render(
        <MemoryRouter>
            <EaImportList {...defaultProps} {...props} />
        </MemoryRouter>
    )
}

describe('EaImportList', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders import file button', () => {
        renderList()
        expect(screen.getByTitle('Import from file')).toBeInTheDocument()
    })

    it('renders hidden file input', () => {
        renderList()
        expect(screen.getByTestId('import-file-input')).toBeInTheDocument()
    })

    it('renders export button on import card', () => {
        renderList()
        expect(screen.getByTitle('Export import')).toBeInTheDocument()
    })

    it('handles valid JSON import', async () => {
        const onSaveImport = vi.fn().mockResolvedValue(undefined)
        const onRefresh = vi.fn().mockResolvedValue(undefined)
        renderList({ onSaveImport, onRefresh })

        const importData = { title: 'Test', date: '2026-01-01', bankSource: 'revolut', transactions: [] }
        const file = new File([JSON.stringify(importData)], 'test.json', { type: 'application/json' })

        const input = screen.getByTestId('import-file-input')
        await userEvent.upload(input, file)

        await waitFor(() => {
            expect(onSaveImport).toHaveBeenCalledOnce()
        })
        const savedData = onSaveImport.mock.calls[0][0]
        expect(savedData.title).toBe('Test')
        expect(savedData.id).toBeTruthy()
        expect(savedData.id).not.toBe(importData.id)
        expect(onRefresh).toHaveBeenCalled()
        expect(toast.success).toHaveBeenCalledWith('Import loaded successfully')
    })

    it('shows error toast on invalid JSON import', async () => {
        renderList()

        const file = new File(['not valid json'], 'bad.json', { type: 'application/json' })
        const input = screen.getByTestId('import-file-input')
        await userEvent.upload(input, file)

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Failed to load import file')
        })
        expect(defaultProps.onSaveImport).not.toHaveBeenCalled()
    })

    it('shows error toast on JSON missing required fields', async () => {
        renderList()

        const file = new File([JSON.stringify({ foo: 'bar' })], 'bad.json', { type: 'application/json' })
        const input = screen.getByTestId('import-file-input')
        await userEvent.upload(input, file)

        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Invalid import file format')
        })
    })

    it('triggers download on export click', async () => {
        const createObjectURL = vi.fn().mockReturnValue('blob:test')
        const revokeObjectURL = vi.fn()
        globalThis.URL.createObjectURL = createObjectURL
        globalThis.URL.revokeObjectURL = revokeObjectURL

        const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})
        const appendChildSpy = vi.spyOn(document.body, 'appendChild')

        renderList()
        const exportButton = screen.getByTitle('Export import')
        await userEvent.click(exportButton)

        await waitFor(() => {
            expect(clickSpy).toHaveBeenCalled()
        })

        const anchor = appendChildSpy.mock.calls.find(
            ([node]) => node instanceof HTMLAnchorElement
        )?.[0] as HTMLAnchorElement
        expect(anchor.download).toMatch(/^ea-january-import-2026-01-15\.json$/)
        expect(createObjectURL).toHaveBeenCalled()
        expect(revokeObjectURL).toHaveBeenCalled()

        vi.restoreAllMocks()
    })
})
