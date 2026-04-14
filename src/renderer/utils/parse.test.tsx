import { describe, it, expect } from 'vitest'
import { parseTamFormData, parseToTamResponse, parseToChartData, parseNetWorthData, computeNetWorth, computeAnnualCost, convertAnnualToUnit } from './parse'
import { INIT_TAM_DATA, INIT_NW_DATA } from './constants'
import { NetWorthEntry, TamFormResponse } from './types'

describe('parseTamFormData', () => {
  it('parses a valid object', () => {
    const input = {
      assets: [{ assetName: 'BTC', unitPrice: 100, quantityOwned: 2, targetPercent: 50 }],
      budget: 1000,
      currency: 'EUR',
    }
    const result = parseTamFormData(input)
    expect(result.assets[0].assetName).toBe('BTC')
    expect(result.budget).toBe(1000)
  })

  it('parses a valid JSON string', () => {
    const input = JSON.stringify({
      assets: [{ id: 'x', assetName: 'ETH', unitPrice: 50, quantityOwned: 1, targetPercent: 100 }],
      budget: 500,
      currency: 'USD',
    })
    const result = parseTamFormData(input)
    expect(result.assets[0].assetName).toBe('ETH')
    expect(result.assets[0].id).toBe('x')
  })

  it('returns INIT_TAM_DATA for empty object', () => {
    const result = parseTamFormData({})
    expect(result.assets.length).toBe(INIT_TAM_DATA.assets.length)
    expect(result.budget).toBe(INIT_TAM_DATA.budget)
  })

  it('assigns UUID to assets without id', () => {
    const input = {
      assets: [{ assetName: 'BTC', unitPrice: 100, quantityOwned: 1, targetPercent: 100 }],
      budget: 100,
      currency: 'EUR',
    }
    const result = parseTamFormData(input)
    expect(result.assets[0].id).toBeDefined()
    expect(result.assets[0].id).toContain('test-uuid')
  })

  it('preserves existing asset id', () => {
    const input = {
      assets: [{ id: 'existing-id', assetName: 'BTC', unitPrice: 100, quantityOwned: 1, targetPercent: 100 }],
      budget: 100,
      currency: 'EUR',
    }
    const result = parseTamFormData(input)
    expect(result.assets[0].id).toBe('existing-id')
  })

  it('throws on invalid JSON string', () => {
    expect(() => parseTamFormData('not json{{')).toThrow('Failed to parse JSON data')
  })
})

describe('parseToTamResponse', () => {
  it('returns TamFormResponse for valid array', () => {
    const input = [
      { assetName: 'BTC', unitPrice: 100, oldQuantity: 1, newQuantity: 2, additionalQuantity: 1, assetProp: 50, newProp: 55 },
    ]
    const result = parseToTamResponse(input)
    expect(result.assets).toHaveLength(1)
    expect(result.assets[0].assetName).toBe('BTC')
  })

  it('throws on non-array input', () => {
    expect(() => parseToTamResponse('not array')).toThrow('Invalid input type or structure')
  })

  it('throws when objects lack assetName', () => {
    expect(() => parseToTamResponse([{ unitPrice: 100 }])).toThrow('Invalid input type or structure')
  })
})

describe('parseToChartData', () => {
  it('maps response assets to chart data', () => {
    const response: TamFormResponse = {
      assets: [
        { assetName: 'BTC', unitPrice: 100, oldQuantity: 2, newQuantity: 3, additionalQuantity: 1, assetProp: 50, newProp: 60 },
        { assetName: 'ETH', unitPrice: 50, oldQuantity: 5, newQuantity: 7, additionalQuantity: 2, assetProp: 50, newProp: 40 },
      ],
    }

    const result = parseToChartData(response)

    expect(result.labels).toEqual(['BTC (60%)', 'ETH (40%)'])
    expect(result.datasets).toHaveLength(2)
    expect(result.datasets[0].label).toBe('Current Volume')
    expect(result.datasets[1].label).toBe('Next Buy')
    // oldQuantity * unitPrice
    expect(result.datasets[0].data[0]).toBe(200)
    expect(result.datasets[0].data[1]).toBe(250)
    // additionalQuantity * unitPrice
    expect(result.datasets[1].data[0]).toBe(100)
    expect(result.datasets[1].data[1]).toBe(100)
    // nbsToBuy
    expect(result.nbsToBuy).toEqual([1, 2])
    // targets = assetProp * unitPrice
    expect(result.targets).toEqual([5000, 2500])
  })
})

describe('parseNetWorthData', () => {
  it('parses valid data with entries', () => {
    const input = {
      entries: [
        { id: 'e1', date: '2024-01-01', items: [{ id: 'i1', name: 'Savings', estimatedValue: 5000 }] },
      ],
      currency: 'EUR',
    }
    const result = parseNetWorthData(input)
    expect(result.entries).toHaveLength(1)
    expect(result.entries[0].items[0].name).toBe('Savings')
  })

  it('returns INIT_NW_DATA for empty object', () => {
    const result = parseNetWorthData({})
    expect(result).toEqual(INIT_NW_DATA)
  })

  it('returns INIT_NW_DATA when entries is missing', () => {
    const result = parseNetWorthData({ currency: 'EUR' })
    expect(result).toEqual(INIT_NW_DATA)
  })

  it('returns INIT_NW_DATA on invalid JSON string', () => {
    const result = parseNetWorthData('not json{{')
    expect(result).toEqual(INIT_NW_DATA)
  })

  it('assigns UUIDs to entries and items without ids', () => {
    const input = {
      entries: [
        { date: '2024-01-01', items: [{ name: 'Cash', estimatedValue: 100 }] },
      ],
      currency: 'EUR',
    }
    const result = parseNetWorthData(input)
    expect(result.entries[0].id).toContain('test-uuid')
    expect(result.entries[0].items[0].id).toContain('test-uuid')
  })

  it('preserves existing ids', () => {
    const input = {
      entries: [
        { id: 'kept', date: '2024-01-01', items: [{ id: 'also-kept', name: 'Cash', estimatedValue: 100 }] },
      ],
      currency: 'EUR',
    }
    const result = parseNetWorthData(input)
    expect(result.entries[0].id).toBe('kept')
    expect(result.entries[0].items[0].id).toBe('also-kept')
  })
})

describe('computeNetWorth', () => {
  it('sums item values correctly', () => {
    const entry: NetWorthEntry = {
      id: '1',
      date: '2024-01-01',
      items: [
        { id: 'a', name: 'Savings', estimatedValue: 5000 },
        { id: 'b', name: 'Stocks', estimatedValue: 10000 },
      ],
    }
    expect(computeNetWorth(entry)).toBe(15000)
  })

  it('returns 0 for empty items array', () => {
    const entry: NetWorthEntry = { id: '1', date: '2024-01-01', items: [] }
    expect(computeNetWorth(entry)).toBe(0)
  })

  it('handles negative values (liabilities)', () => {
    const entry: NetWorthEntry = {
      id: '1',
      date: '2024-01-01',
      items: [
        { id: 'a', name: 'House', estimatedValue: 200000 },
        { id: 'b', name: 'Mortgage', estimatedValue: -150000 },
      ],
    }
    expect(computeNetWorth(entry)).toBe(50000)
  })
})

describe('computeAnnualCost', () => {
  const makeItem = (unitPrice: number, quantity: number, every: number, unit: 'day' | 'week' | 'month' | 'year') => ({
    id: '1', emoji: '', name: 'Test', unitPrice, quantity, recurrence: { every, unit }, tag: '',
  })

  it('computes monthly recurrence', () => {
    expect(computeAnnualCost(makeItem(10, 1, 1, 'month'))).toBe(120)
  })

  it('computes daily recurrence', () => {
    expect(computeAnnualCost(makeItem(1, 1, 1, 'day'))).toBe(365)
  })

  it('computes weekly recurrence', () => {
    expect(computeAnnualCost(makeItem(10, 1, 1, 'week'))).toBe(520)
  })

  it('computes yearly recurrence', () => {
    expect(computeAnnualCost(makeItem(100, 1, 1, 'year'))).toBe(100)
  })

  it('handles every N units', () => {
    expect(computeAnnualCost(makeItem(10, 1, 3, 'month'))).toBe(40)
  })

  it('multiplies by quantity', () => {
    expect(computeAnnualCost(makeItem(10, 3, 1, 'month'))).toBe(360)
  })

  it('returns 0 when every is 0', () => {
    expect(computeAnnualCost(makeItem(10, 1, 0, 'month'))).toBe(0)
  })
})

describe('convertAnnualToUnit', () => {
  it('returns same value for year', () => {
    expect(convertAnnualToUnit(365, 'year')).toBe(365)
  })

  it('divides by 12 for month', () => {
    expect(convertAnnualToUnit(120, 'month')).toBe(10)
  })

  it('divides by 52 for week', () => {
    expect(convertAnnualToUnit(520, 'week')).toBe(10)
  })

  it('divides by 365 for day', () => {
    expect(convertAnnualToUnit(365, 'day')).toBe(1)
  })
})
