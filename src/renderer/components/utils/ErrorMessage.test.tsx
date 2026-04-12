import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorMessages } from './ErrorMessage'

describe('ErrorMessages', () => {
  it('renders a list of error messages', () => {
    render(<ErrorMessages errorMessages={['Error 1', 'Error 2']} />)
    expect(screen.getByText('Error 1')).toBeInTheDocument()
    expect(screen.getByText('Error 2')).toBeInTheDocument()
  })

  it('renders empty when no messages', () => {
    const { container } = render(<ErrorMessages errorMessages={[]} />)
    expect(container.querySelectorAll('p')).toHaveLength(0)
  })
})
