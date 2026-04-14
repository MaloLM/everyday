import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

vi.mock('../../../context', () => ({
    useAppContext: vi.fn().mockReturnValue({
        blurFinances: false,
        toggleBlurFinances: vi.fn(),
    }),
}))

import { SpForm } from './SpForm'

function renderForm(props = {}) {
    const defaultProps = {
        spData: { projects: [], currency: 'EUR' },
        onSave: vi.fn().mockResolvedValue(undefined),
    }
    return render(<SpForm {...defaultProps} {...props} />)
}

describe('SpForm', () => {
    it('renders the title', () => {
        renderForm()
        expect(screen.getByText('Savings Projects')).toBeInTheDocument()
    })

    it('shows Save button', () => {
        renderForm()
        expect(screen.getByTitle('Save savings projects')).toBeInTheDocument()
    })

    it('shows Overview card with totals', () => {
        renderForm()
        expect(screen.getByText('Overview')).toBeInTheDocument()
        expect(screen.getByText('Total saved')).toBeInTheDocument()
        expect(screen.getByText('Total objective')).toBeInTheDocument()
    })

    it('shows empty state when no projects', () => {
        renderForm()
        expect(screen.getByText('No savings projects yet.')).toBeInTheDocument()
    })

    it('renders populated projects', () => {
        const spData = {
            projects: [
                { id: 'p1', title: 'Trip', objective: 3000, startingValue: 500, monthlyContributions: { '2026-01': 200 } },
                { id: 'p2', title: 'Car', objective: 15000, startingValue: 1000, monthlyContributions: {} },
            ],
            currency: 'EUR',
        }
        renderForm({ spData })
        expect(screen.getByDisplayValue('Trip')).toBeInTheDocument()
        expect(screen.getByDisplayValue('Car')).toBeInTheDocument()
    })

    it('shows Add Project button when projects exist', () => {
        const spData = {
            projects: [
                { id: 'p1', title: 'Trip', objective: 3000, startingValue: 0, monthlyContributions: {} },
            ],
            currency: 'EUR',
        }
        renderForm({ spData })
        expect(screen.getByText('Add Project')).toBeInTheDocument()
    })

    it('adds a new project when Add Project is clicked', async () => {
        renderForm()
        const user = userEvent.setup()
        await user.click(screen.getByText('Add Project'))
        await waitFor(() => {
            // After adding a project, empty state should be gone and we should see the table
            expect(screen.queryByText('No savings projects yet.')).not.toBeInTheDocument()
        })
    })
})
