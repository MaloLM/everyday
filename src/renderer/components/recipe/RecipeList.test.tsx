import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RecipeList } from './RecipeList'
import { Recipe } from '../../utils/types'

const mockRecipes: Recipe[] = [
  {
    id: 'r1',
    title: 'Pancakes',
    instructions: 'Mix and cook',
    ingredients: [{ id: 'i1', name: 'Flour', quantity: '200', unit: 'g' }],
    tools: [{ id: 't1', name: 'Pan' }],
    prepTime: 20,
    cost: 2,
    dishesCost: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
  {
    id: 'r2',
    title: 'Omelette',
    instructions: '',
    ingredients: [{ id: 'i2', name: 'Eggs', quantity: '3', unit: '' }],
    tools: [],
    prepTime: 10,
    cost: 1,
    dishesCost: null,
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z',
  },
]

const defaultProps = {
  recipes: mockRecipes,
  onSelect: vi.fn(),
  onNew: vi.fn(),
  onDelete: vi.fn(),
  onDuplicate: vi.fn(),
}

describe('RecipeList', () => {
  it('renders all recipe titles', () => {
    render(<RecipeList {...defaultProps} />)
    expect(screen.getByText('Pancakes')).toBeInTheDocument()
    expect(screen.getByText('Omelette')).toBeInTheDocument()
  })

  it('renders the New Recipe button', () => {
    render(<RecipeList {...defaultProps} />)
    expect(screen.getByText('New Recipe')).toBeInTheDocument()
  })

  it('renders the search input', () => {
    render(<RecipeList {...defaultProps} />)
    expect(screen.getByPlaceholderText('Search recipes...')).toBeInTheDocument()
  })

  it('filters recipes by search term', async () => {
    render(<RecipeList {...defaultProps} />)
    await userEvent.type(screen.getByPlaceholderText('Search recipes...'), 'Pancake')
    expect(screen.getByText('Pancakes')).toBeInTheDocument()
    expect(screen.queryByText('Omelette')).not.toBeInTheDocument()
  })

  it('shows no-match message when search finds nothing', async () => {
    render(<RecipeList {...defaultProps} />)
    await userEvent.type(screen.getByPlaceholderText('Search recipes...'), 'xyz')
    expect(screen.getByText('No recipes match your search.')).toBeInTheDocument()
  })

  it('shows empty state message when no recipes exist', () => {
    render(<RecipeList {...defaultProps} recipes={[]} />)
    expect(screen.getByText('No recipes yet. Create your first one!')).toBeInTheDocument()
  })

  it('calls onSelect when a recipe card is clicked', async () => {
    const onSelect = vi.fn()
    render(<RecipeList {...defaultProps} onSelect={onSelect} />)
    await userEvent.click(screen.getByText('Pancakes'))
    expect(onSelect).toHaveBeenCalledWith('r1')
  })

  it('calls onNew when New Recipe button is clicked', async () => {
    const onNew = vi.fn()
    render(<RecipeList {...defaultProps} onNew={onNew} />)
    await userEvent.click(screen.getByText('New Recipe'))
    expect(onNew).toHaveBeenCalledOnce()
  })

  it('shows ingredient count for recipes', () => {
    render(<RecipeList {...defaultProps} />)
    const counts = screen.getAllByText('1 ingredient')
    expect(counts.length).toBe(2)
  })
})
