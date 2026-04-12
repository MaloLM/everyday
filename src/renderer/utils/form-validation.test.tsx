import { describe, it, expect } from 'vitest'
import { TamFormSchema, NwEntrySchema } from './form-validation'

describe('TamFormSchema', () => {
  const validForm = {
    assets: [
      { assetName: 'BTC', unitPrice: 100, quantityOwned: 2, targetPercent: 60 },
      { assetName: 'ETH', unitPrice: 50, quantityOwned: 3, targetPercent: 40 },
    ],
    budget: 1000,
    currency: 'EUR',
  }

  it('passes for valid form data', async () => {
    await expect(TamFormSchema.validate(validForm)).resolves.toBeDefined()
  })

  it('fails when asset name is missing', async () => {
    const data = {
      ...validForm,
      assets: [{ ...validForm.assets[0], assetName: '' }, validForm.assets[1]],
    }
    await expect(TamFormSchema.validate(data)).rejects.toThrow()
  })

  it('fails when unit price is less than 1', async () => {
    const data = {
      ...validForm,
      assets: [{ ...validForm.assets[0], unitPrice: 0 }, validForm.assets[1]],
    }
    await expect(TamFormSchema.validate(data)).rejects.toThrow()
  })

  it('fails when quantity is negative', async () => {
    const data = {
      ...validForm,
      assets: [{ ...validForm.assets[0], quantityOwned: -1 }, validForm.assets[1]],
    }
    await expect(TamFormSchema.validate(data)).rejects.toThrow()
  })

  it('fails when target percents do not sum to 100', async () => {
    const data = {
      ...validForm,
      assets: [
        { assetName: 'BTC', unitPrice: 100, quantityOwned: 2, targetPercent: 30 },
        { assetName: 'ETH', unitPrice: 50, quantityOwned: 3, targetPercent: 30 },
      ],
    }
    await expect(TamFormSchema.validate(data)).rejects.toThrow('Total target % must equal 100')
  })

  it('fails when budget is negative', async () => {
    const data = { ...validForm, budget: -100 }
    await expect(TamFormSchema.validate(data)).rejects.toThrow()
  })

  it('fails when currency is missing', async () => {
    const data = { ...validForm, currency: '' }
    await expect(TamFormSchema.validate(data)).rejects.toThrow()
  })
})

describe('NwEntrySchema', () => {
  const validEntry = {
    date: '2024-01-15',
    items: [{ name: 'Savings', estimatedValue: 5000 }],
  }

  it('passes for valid entry', async () => {
    await expect(NwEntrySchema.validate(validEntry)).resolves.toBeDefined()
  })

  it('fails for invalid date format', async () => {
    const data = { ...validEntry, date: '15/01/2024' }
    await expect(NwEntrySchema.validate(data)).rejects.toThrow('Date must be in YYYY-MM-DD format')
  })

  it('fails when date is missing', async () => {
    const data = { ...validEntry, date: '' }
    await expect(NwEntrySchema.validate(data)).rejects.toThrow()
  })

  it('fails when items array is empty', async () => {
    const data = { ...validEntry, items: [] }
    await expect(NwEntrySchema.validate(data)).rejects.toThrow('At least one item is required')
  })

  it('fails when item name is empty', async () => {
    const data = { ...validEntry, items: [{ name: '', estimatedValue: 100 }] }
    await expect(NwEntrySchema.validate(data)).rejects.toThrow()
  })

  it('fails when item name exceeds 50 characters', async () => {
    const data = { ...validEntry, items: [{ name: 'a'.repeat(51), estimatedValue: 100 }] }
    await expect(NwEntrySchema.validate(data)).rejects.toThrow('50 characters')
  })

  it('fails when estimatedValue is not a number', async () => {
    const data = { ...validEntry, items: [{ name: 'X', estimatedValue: 'abc' }] }
    await expect(NwEntrySchema.validate(data)).rejects.toThrow('must be a number')
  })

  it('accepts negative estimated values', async () => {
    const data = { ...validEntry, items: [{ name: 'Debt', estimatedValue: -5000 }] }
    await expect(NwEntrySchema.validate(data)).resolves.toBeDefined()
  })
})
