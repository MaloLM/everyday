import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Sidebar } from './Sidebar'

function renderSidebar(route = '/tam') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <Sidebar />
    </MemoryRouter>
  )
}

describe('Sidebar', () => {
  it('renders all navigation items', () => {
    renderSidebar()
    expect(screen.getByText('Target Allocation Maintenance')).toBeInTheDocument()
    expect(screen.getByText('Net Worth Assessment')).toBeInTheDocument()
    expect(screen.getByText('Recurring Purchases')).toBeInTheDocument()
    expect(screen.getByText('Recipes')).toBeInTheDocument()
  })

  it('renders a toggle button', () => {
    renderSidebar()
    expect(screen.getByRole('button', { name: /open sidebar/i })).toBeInTheDocument()
  })

  it('highlights active nav item based on current route', () => {
    renderSidebar('/tam')
    const tamLink = screen.getByText('Target Allocation Maintenance').closest('a')
    expect(tamLink).toHaveClass('bg-nobleGold/15')
  })

  it('does not highlight inactive nav items', () => {
    renderSidebar('/tam')
    const nwLink = screen.getByText('Net Worth Assessment').closest('a')
    expect(nwLink).not.toHaveClass('bg-nobleGold/15')
  })

  it('highlights TAM when on root path /', () => {
    renderSidebar('/')
    const tamLink = screen.getByText('Target Allocation Maintenance').closest('a')
    expect(tamLink).toHaveClass('bg-nobleGold/15')
  })
})
