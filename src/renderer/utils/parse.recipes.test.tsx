import { describe, it, expect } from 'vitest'
import { parseRecipesData } from './parse'
import { INIT_RECIPES_DATA } from './constants'

describe('parseRecipesData', () => {
  it('parses valid data with recipes', () => {
    const input = {
      recipes: [
        {
          id: 'r1',
          title: 'Pancakes',
          instructions: '## Mix\n1. Mix ingredients',
          ingredients: [{ id: 'i1', name: 'Flour', quantity: '200', unit: 'g' }],
          tools: [{ id: 't1', name: 'Whisk' }],
          prepTime: 30,
          cost: 2,
          dishesCost: 3,
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    }
    const result = parseRecipesData(input)
    expect(result.recipes).toHaveLength(1)
    expect(result.recipes[0].title).toBe('Pancakes')
    expect(result.recipes[0].ingredients[0].name).toBe('Flour')
    expect(result.recipes[0].tools[0].name).toBe('Whisk')
  })

  it('parses a valid JSON string', () => {
    const input = JSON.stringify({
      recipes: [{ id: 'r1', title: 'Toast', instructions: '', ingredients: [], tools: [], prepTime: null, cost: null, dishesCost: null, createdAt: '', updatedAt: '' }],
    })
    const result = parseRecipesData(input)
    expect(result.recipes[0].title).toBe('Toast')
  })

  it('returns INIT_RECIPES_DATA for empty object', () => {
    const result = parseRecipesData({})
    expect(result).toEqual(INIT_RECIPES_DATA)
  })

  it('returns INIT_RECIPES_DATA when recipes is missing', () => {
    const result = parseRecipesData({ something: 'else' })
    expect(result).toEqual(INIT_RECIPES_DATA)
  })

  it('returns INIT_RECIPES_DATA on invalid JSON string', () => {
    const result = parseRecipesData('not json{{')
    expect(result).toEqual(INIT_RECIPES_DATA)
  })

  it('assigns UUIDs to recipes without ids', () => {
    const input = {
      recipes: [
        { title: 'No ID', instructions: '', ingredients: [], tools: [], prepTime: null, cost: null, dishesCost: null, createdAt: '', updatedAt: '' },
      ],
    }
    const result = parseRecipesData(input)
    expect(result.recipes[0].id).toBeDefined()
    expect(result.recipes[0].id).toContain('test-uuid')
  })

  it('preserves existing recipe id', () => {
    const input = {
      recipes: [
        { id: 'kept-id', title: 'Existing', instructions: '', ingredients: [], tools: [], prepTime: null, cost: null, dishesCost: null, createdAt: '', updatedAt: '' },
      ],
    }
    const result = parseRecipesData(input)
    expect(result.recipes[0].id).toBe('kept-id')
  })

  it('assigns UUIDs to ingredients without ids', () => {
    const input = {
      recipes: [
        {
          id: 'r1', title: 'Test', instructions: '', tools: [],
          ingredients: [{ name: 'Egg', quantity: '3', unit: '' }],
          prepTime: null, cost: null, dishesCost: null, createdAt: '', updatedAt: '',
        },
      ],
    }
    const result = parseRecipesData(input)
    expect(result.recipes[0].ingredients[0].id).toContain('test-uuid')
  })

  it('assigns UUIDs to tools without ids', () => {
    const input = {
      recipes: [
        {
          id: 'r1', title: 'Test', instructions: '', ingredients: [],
          tools: [{ name: 'Oven' }],
          prepTime: null, cost: null, dishesCost: null, createdAt: '', updatedAt: '',
        },
      ],
    }
    const result = parseRecipesData(input)
    expect(result.recipes[0].tools[0].id).toContain('test-uuid')
  })

  it('preserves existing ingredient and tool ids', () => {
    const input = {
      recipes: [
        {
          id: 'r1', title: 'Test', instructions: '',
          ingredients: [{ id: 'ing-kept', name: 'Salt', quantity: '1', unit: 'tsp' }],
          tools: [{ id: 'tool-kept', name: 'Pan' }],
          prepTime: null, cost: null, dishesCost: null, createdAt: '', updatedAt: '',
        },
      ],
    }
    const result = parseRecipesData(input)
    expect(result.recipes[0].ingredients[0].id).toBe('ing-kept')
    expect(result.recipes[0].tools[0].id).toBe('tool-kept')
  })

  it('handles missing ingredients and tools arrays gracefully', () => {
    const input = {
      recipes: [
        { id: 'r1', title: 'Bare', instructions: '', prepTime: null, cost: null, dishesCost: null, createdAt: '', updatedAt: '' },
      ],
    }
    const result = parseRecipesData(input)
    expect(result.recipes[0].ingredients).toEqual([])
    expect(result.recipes[0].tools).toEqual([])
  })
})
