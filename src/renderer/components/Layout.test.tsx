import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Layout } from './Layout'

describe('Layout', () => {
  it('renders children', () => {
    render(
      <MemoryRouter>
        <Layout>
          <p>Page content</p>
        </Layout>
      </MemoryRouter>
    )
    expect(screen.getByText('Page content')).toBeInTheDocument()
  })

  it('renders the sidebar', () => {
    render(
      <MemoryRouter>
        <Layout>Content</Layout>
      </MemoryRouter>
    )
    expect(screen.getByLabelText('Sidebar')).toBeInTheDocument()
  })
})
