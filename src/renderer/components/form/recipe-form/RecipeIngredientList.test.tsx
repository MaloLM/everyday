import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecipeIngredientList } from './RecipeIngredientList'

const mockIngredients = [
  { id: 'i1', name: 'Flour', quantity: '200', unit: 'g' },
  { id: 'i2', name: 'Eggs', quantity: '3', unit: '' },
]

describe('RecipeIngredientList', () => {
  it('renders all ingredients', () => {
    render(<RecipeIngredientList ingredients={mockIngredients} onChange={vi.fn()} />)
    expect(screen.getByDisplayValue('Flour')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Eggs')).toBeInTheDocument()
  })

  it('shows "No ingredients added" when list is empty', () => {
    render(<RecipeIngredientList ingredients={[]} onChange={vi.fn()} />)
    expect(screen.getByText('No ingredients added')).toBeInTheDocument()
  })

  it('has an Add ingredient button', () => {
    render(<RecipeIngredientList ingredients={[]} onChange={vi.fn()} />)
    expect(screen.getByText('Add ingredient')).toBeInTheDocument()
  })

  it('calls onChange with a new ingredient when Add is clicked', async () => {
    const onChange = vi.fn()
    render(<RecipeIngredientList ingredients={mockIngredients} onChange={onChange} />)
    await userEvent.click(screen.getByText('Add ingredient'))
    expect(onChange).toHaveBeenCalledWith(
      expect.arrayContaining([
        ...mockIngredients,
        expect.objectContaining({ name: '', quantity: '', unit: '' }),
      ])
    )
  })

  it('calls onChange without the deleted ingredient when delete is clicked', async () => {
    const onChange = vi.fn()
    render(<RecipeIngredientList ingredients={mockIngredients} onChange={onChange} />)
    const deleteButtons = screen.getAllByRole('button').filter((b) => b.querySelector('svg'))
    // The first delete button (X icon) corresponds to the first ingredient
    await userEvent.click(deleteButtons[0])
    expect(onChange).toHaveBeenCalledWith([mockIngredients[1]])
  })

  it('renders quantity and unit values', () => {
    render(<RecipeIngredientList ingredients={mockIngredients} onChange={vi.fn()} />)
    expect(screen.getByDisplayValue('200')).toBeInTheDocument()
    expect(screen.getByDisplayValue('3')).toBeInTheDocument()
  })
})
