import { describe, it, expect } from 'vitest'
import { run_tam_optimization } from './targetAllocationMaintenance'

function makeData(assets, budget = 1000) {
  return {
    assets: assets.map((a) => ({ ...a })),
    currency: 'EUR',
    budget,
  }
}

describe('run_tam_optimization', () => {
  it('distributes budget proportionally to target gap', () => {
    const data = makeData([
      { assetName: 'A', unitPrice: 10, quantityOwned: 0, targetPercent: 50 },
      { assetName: 'B', unitPrice: 10, quantityOwned: 0, targetPercent: 50 },
    ], 100)

    const result = run_tam_optimization(data)
    const a = result.find((r) => r.assetName === 'A')
    const b = result.find((r) => r.assetName === 'B')

    expect(a.additionalQuantity).toBeGreaterThan(0)
    expect(b.additionalQuantity).toBeGreaterThan(0)
    // Both should get roughly equal allocation
    expect(Math.abs(a.additionalQuantity - b.additionalQuantity)).toBeLessThanOrEqual(1)
  })

  it('returns all assets with additionalQuantity 0 when budget is zero', () => {
    const data = makeData([
      { assetName: 'A', unitPrice: 100, quantityOwned: 5, targetPercent: 60 },
      { assetName: 'B', unitPrice: 50, quantityOwned: 3, targetPercent: 40 },
    ], 0)

    const result = run_tam_optimization(data)
    result.forEach((adj) => {
      expect(adj.additionalQuantity).toBe(0)
    })
  })

  it('makes no purchases when budget is less than cheapest unit price', () => {
    const data = makeData([
      { assetName: 'A', unitPrice: 500, quantityOwned: 1, targetPercent: 50 },
      { assetName: 'B', unitPrice: 300, quantityOwned: 1, targetPercent: 50 },
    ], 100)

    const result = run_tam_optimization(data)
    result.forEach((adj) => {
      expect(adj.additionalQuantity).toBe(0)
    })
  })

  it('allocates all budget to single asset', () => {
    const data = makeData([
      { assetName: 'A', unitPrice: 10, quantityOwned: 0, targetPercent: 100 },
    ], 100)

    const result = run_tam_optimization(data)
    expect(result[0].additionalQuantity).toBe(10)
    expect(result[0].newQuantity).toBe(10)
  })

  it('does not buy assets already above their target', () => {
    // A is already heavily over-weighted, B is under
    const data = makeData([
      { assetName: 'A', unitPrice: 10, quantityOwned: 100, targetPercent: 10 },
      { assetName: 'B', unitPrice: 10, quantityOwned: 1, targetPercent: 90 },
    ], 200)

    const result = run_tam_optimization(data)
    const a = result.find((r) => r.assetName === 'A')
    const b = result.find((r) => r.assetName === 'B')

    expect(a.additionalQuantity).toBe(0)
    expect(b.additionalQuantity).toBeGreaterThan(0)
  })

  it('computes newProp values that reflect final allocation', () => {
    const data = makeData([
      { assetName: 'A', unitPrice: 50, quantityOwned: 2, targetPercent: 50 },
      { assetName: 'B', unitPrice: 25, quantityOwned: 4, targetPercent: 50 },
    ], 500)

    const result = run_tam_optimization(data)
    const totalProp = result.reduce((sum, adj) => sum + adj.newProp, 0)
    expect(totalProp).toBeCloseTo(100, 0)
  })

  it('preserves oldQuantity in adjustments', () => {
    const data = makeData([
      { assetName: 'A', unitPrice: 10, quantityOwned: 5, targetPercent: 50 },
      { assetName: 'B', unitPrice: 10, quantityOwned: 3, targetPercent: 50 },
    ], 100)

    const result = run_tam_optimization(data)
    expect(result.find((r) => r.assetName === 'A').oldQuantity).toBe(5)
    expect(result.find((r) => r.assetName === 'B').oldQuantity).toBe(3)
  })

  it('newQuantity equals oldQuantity + additionalQuantity', () => {
    const data = makeData([
      { assetName: 'A', unitPrice: 10, quantityOwned: 2, targetPercent: 60 },
      { assetName: 'B', unitPrice: 10, quantityOwned: 3, targetPercent: 40 },
    ], 100)

    const result = run_tam_optimization(data)
    result.forEach((adj) => {
      expect(adj.newQuantity).toBe(adj.oldQuantity + adj.additionalQuantity)
    })
  })
})
