import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Formik, Form } from 'formik'
import { SpTable } from './SpTable'

function renderTable(props = {}) {
    const defaultProjects = [
        { id: 'p1', title: 'Trip', objective: 3000, startingValue: 500, monthlyContributions: { '2026-01': 200, '2026-02': 150 } },
    ]
    const defaultProps = {
        projects: defaultProjects,
        months: ['2026-01', '2026-02', '2026-03'],
        currency: 'EUR',
        onAdd: vi.fn(),
        onDelete: vi.fn(),
    }
    const mergedProps = { ...defaultProps, ...props }

    return render(
        <Formik
            initialValues={{ projects: mergedProps.projects }}
            onSubmit={vi.fn()}
        >
            <Form>
                <SpTable {...mergedProps} />
            </Form>
        </Formik>
    )
}

describe('SpTable', () => {
    it('renders month column headers', () => {
        renderTable()
        expect(screen.getByText('Jan 26')).toBeInTheDocument()
        expect(screen.getByText('Feb 26')).toBeInTheDocument()
        expect(screen.getByText('Mar 26')).toBeInTheDocument()
    })

    it('renders fixed column headers', () => {
        renderTable()
        expect(screen.getByText('Project')).toBeInTheDocument()
        expect(screen.getByText('Objective')).toBeInTheDocument()
        expect(screen.getByText('Total')).toBeInTheDocument()
        expect(screen.getByText('Starting')).toBeInTheDocument()
    })

    it('renders computed total for a project', () => {
        renderTable()
        // 500 (starting) + 200 + 150 = 850
        expect(screen.getByText('850')).toBeInTheDocument()
    })

    it('renders progress fraction and percentage', () => {
        renderTable()
        // 850/3000 = ~28%
        expect(screen.getByText('28%')).toBeInTheDocument()
        expect(screen.getByText(/3.*000/)).toBeInTheDocument()
    })

    it('shows Add Project button', () => {
        renderTable()
        expect(screen.getByText('Add Project')).toBeInTheDocument()
    })

    it('shows empty state when no projects', () => {
        renderTable({ projects: [] })
        expect(screen.getByText('No savings projects yet.')).toBeInTheDocument()
    })

    it('renders delete button for each project', () => {
        renderTable()
        expect(screen.getByTitle('Remove project')).toBeInTheDocument()
    })

    it('shows progress above 100% when objective exceeded', () => {
        const projects = [
            { id: 'p1', title: 'Done', objective: 100, startingValue: 150, monthlyContributions: {} },
        ]
        renderTable({ projects })
        expect(screen.getByText('150%')).toBeInTheDocument()
    })
})
