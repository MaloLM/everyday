import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecipeToolList } from './RecipeToolList'

const mockTools = [
  { id: 't1', name: 'Whisk' },
  { id: 't2', name: 'Oven' },
]

describe('RecipeToolList', () => {
  it('renders all tools', () => {
    render(<RecipeToolList tools={mockTools} onChange={vi.fn()} />)
    expect(screen.getByDisplayValue('Whisk')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Oven')).toBeInTheDocument()
  })

  it('shows "No tools added" when list is empty', () => {
    render(<RecipeToolList tools={[]} onChange={vi.fn()} />)
    expect(screen.getByText('No tools added')).toBeInTheDocument()
  })

  it('has an Add tool button', () => {
    render(<RecipeToolList tools={[]} onChange={vi.fn()} />)
    expect(screen.getByText('Add tool')).toBeInTheDocument()
  })

  it('calls onChange with a new tool when Add is clicked', async () => {
    const onChange = vi.fn()
    render(<RecipeToolList tools={mockTools} onChange={onChange} />)
    await userEvent.click(screen.getByText('Add tool'))
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        ...mockTools,
        expect.objectContaining({ name: '' }),
      ])
    )
  })

  it('calls onChange without the deleted tool when delete is clicked', async () => {
    const onChange = vi.fn()
    render(<RecipeToolList tools={mockTools} onChange={onChange} />)
    const deleteButtons = screen.getAllByRole('button').filter((b) => b.querySelector('svg'))
    await userEvent.click(deleteButtons[0])
    expect(onChange).toHaveBeenCalledWith([mockTools[1]])
  })
})
