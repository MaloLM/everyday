import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from './Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('renders title when provided', () => {
    render(<Card title="My Card">Content</Card>)
    expect(screen.getByText('My Card')).toBeInTheDocument()
  })

  it('does not render title section when title is not provided', () => {
    const { container } = render(<Card>Content</Card>)
    expect(container.querySelector('h1')).toBeNull()
  })

  it('renders titleButton when provided with title', () => {
    render(
      <Card title="Title" titleButton={<button>Action</button>}>
        Content
      </Card>
    )
    expect(screen.getByText('Action')).toBeInTheDocument()
  })
})
