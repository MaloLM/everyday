import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from './Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('applies filled styles when filled prop is true', () => {
    render(<Button filled>Filled</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-nobleGold')
  })

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('defaults to type="button"', () => {
    render(<Button>Default</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('supports type="submit"', () => {
    render(<Button type="submit">Submit</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('renders title attribute', () => {
    render(<Button title="Help text">Hover</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('title', 'Help text')
  })
})
