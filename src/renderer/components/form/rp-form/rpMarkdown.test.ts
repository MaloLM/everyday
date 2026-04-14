import { describe, it, expect } from 'vitest'
import { buildRecurringPurchasesMarkdown } from './rpMarkdown'

const makeItem = (overrides = {}) => ({
  id: '1', emoji: '🛒', name: 'Netflix', unitPrice: 15, quantity: 1,
  recurrence: { every: 1, unit: 'month' as const }, tag: 'Entertainment', referenceUrl: '',
  ...overrides,
})

describe('buildRecurringPurchasesMarkdown', () => {
  it('defaults to yearly display', () => {
    const md = buildRecurringPurchasesMarkdown({ items: [makeItem()], currency: 'EUR' })
    expect(md).toContain('**Total:** 180 €')
    expect(md).toContain('/yr')
    expect(md).toContain('Cost /yr')
  })

  it('converts to monthly display', () => {
    const md = buildRecurringPurchasesMarkdown({ items: [makeItem()], currency: 'EUR' }, 'month')
    expect(md).toContain('**Total:** 15 €')
    expect(md).toContain('/mo')
    expect(md).toContain('Cost /mo')
  })

  it('converts to daily display', () => {
    const md = buildRecurringPurchasesMarkdown(
      { items: [makeItem({ unitPrice: 365, recurrence: { every: 1, unit: 'year' } })], currency: 'USD' },
      'day',
    )
    expect(md).toContain('**Total:** 1 $')
    expect(md).toContain('/day')
  })

  it('shows empty message when no items', () => {
    const md = buildRecurringPurchasesMarkdown({ items: [], currency: 'EUR' })
    expect(md).toContain('_No recurring purchases._')
  })
})
