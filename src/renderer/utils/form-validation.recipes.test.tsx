import { describe, it, expect } from 'vitest'
import { RecipeFormSchema } from './form-validation'

describe('RecipeFormSchema', () => {
  const validRecipe = {
    title: 'Chocolate Cake',
    instructions: '## Steps\n1. Mix\n2. Bake',
    ingredients: [{ name: 'Flour', quantity: '200', unit: 'g' }],
    tools: [{ name: 'Oven' }],
    prepTime: 45,
    cost: 3,
    dishesCost: 2,
  }

  it('passes for valid recipe data', async () => {
    await expect(RecipeFormSchema.validate(validRecipe)).resolves.toBeDefined()
  })

  it('passes with only a title (everything else optional)', async () => {
    const minimal = { title: 'Quick Note', instructions: '', ingredients: [], tools: [], prepTime: null, cost: null, dishesCost: null }
    await expect(RecipeFormSchema.validate(minimal)).resolves.toBeDefined()
  })

  it('fails when title is missing', async () => {
    const data = { ...validRecipe, title: '' }
    await expect(RecipeFormSchema.validate(data)).rejects.toThrow()
  })

  it('fails when title exceeds 200 characters', async () => {
    const data = { ...validRecipe, title: 'a'.repeat(201) }
    await expect(RecipeFormSchema.validate(data)).rejects.toThrow('Title too long')
  })

  it('accepts empty instructions', async () => {
    const data = { ...validRecipe, instructions: '' }
    await expect(RecipeFormSchema.validate(data)).resolves.toBeDefined()
  })

  it('fails when ingredient name is missing', async () => {
    const data = { ...validRecipe, ingredients: [{ name: '', quantity: '1', unit: 'g' }] }
    await expect(RecipeFormSchema.validate(data)).rejects.toThrow()
  })

  it('fails when ingredient name exceeds 100 characters', async () => {
    const data = { ...validRecipe, ingredients: [{ name: 'a'.repeat(101), quantity: '1', unit: '' }] }
    await expect(RecipeFormSchema.validate(data)).rejects.toThrow('Name too long')
  })

  it('accepts ingredient without quantity or unit', async () => {
    const data = { ...validRecipe, ingredients: [{ name: 'Salt', quantity: '', unit: '' }] }
    await expect(RecipeFormSchema.validate(data)).resolves.toBeDefined()
  })

  it('fails when tool name is missing', async () => {
    const data = { ...validRecipe, tools: [{ name: '' }] }
    await expect(RecipeFormSchema.validate(data)).rejects.toThrow()
  })

  it('fails when tool name exceeds 100 characters', async () => {
    const data = { ...validRecipe, tools: [{ name: 'a'.repeat(101) }] }
    await expect(RecipeFormSchema.validate(data)).rejects.toThrow('Name too long')
  })

  it('accepts null prepTime', async () => {
    const data = { ...validRecipe, prepTime: null }
    await expect(RecipeFormSchema.validate(data)).resolves.toBeDefined()
  })

  it('fails when prepTime is negative', async () => {
    const data = { ...validRecipe, prepTime: -5 }
    await expect(RecipeFormSchema.validate(data)).rejects.toThrow()
  })

  it('accepts null cost and dishesCost', async () => {
    const data = { ...validRecipe, cost: null, dishesCost: null }
    await expect(RecipeFormSchema.validate(data)).resolves.toBeDefined()
  })

  it('fails when cost exceeds 5', async () => {
    const data = { ...validRecipe, cost: 6 }
    await expect(RecipeFormSchema.validate(data)).rejects.toThrow()
  })

  it('fails when dishesCost is below 1', async () => {
    const data = { ...validRecipe, dishesCost: 0 }
    await expect(RecipeFormSchema.validate(data)).rejects.toThrow()
  })

  it('accepts empty ingredients and tools arrays', async () => {
    const data = { ...validRecipe, ingredients: [], tools: [] }
    await expect(RecipeFormSchema.validate(data)).resolves.toBeDefined()
  })
})
