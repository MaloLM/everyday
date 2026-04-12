import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NwEntryList } from './NwEntryList'
import { NetWorthEntry } from '../../../../renderer/utils'

const entries: NetWorthEntry[] = [
  { id: 'e1', date: '2024-01-15', items: [{ id: 'i1', name: 'Savings', estimatedValue: 5000 }] },
  { id: 'e2', date: '2024-02-15', items: [{ id: 'i2', name: 'Stocks', estimatedValue: 10000 }] },
]

describe('NwEntryList', () => {
  it('renders all entries with dates and totals', () => {
    render(
      <NwEntryList
        entries={entries}
        currency="EUR"
        selectedEntryId={null}
        onSelectEntry={vi.fn()}
        onNewEntry={vi.fn()}
        onDeleteEntry={vi.fn()}
      />
    )
    expect(screen.getByText('2024-01-15')).toBeInTheDocument()
    expect(screen.getByText('2024-02-15')).toBeInTheDocument()
  })

  it('shows "No audit entries yet" when empty', () => {
    render(
      <NwEntryList
        entries={[]}
        currency="EUR"
        selectedEntryId={null}
        onSelectEntry={vi.fn()}
        onNewEntry={vi.fn()}
        onDeleteEntry={vi.fn()}
      />
    )
    expect(screen.getByText('No audit entries yet')).toBeInTheDocument()
  })

  it('has a New Audit button', () => {
    render(
      <NwEntryList
        entries={entries}
        currency="EUR"
        selectedEntryId={null}
        onSelectEntry={vi.fn()}
        onNewEntry={vi.fn()}
        onDeleteEntry={vi.fn()}
      />
    )
    expect(screen.getByText('New Audit')).toBeInTheDocument()
  })

  it('calls onNewEntry when New Audit is clicked', async () => {
    const onNewEntry = vi.fn()
    render(
      <NwEntryList
        entries={entries}
        currency="EUR"
        selectedEntryId={null}
        onSelectEntry={vi.fn()}
        onNewEntry={onNewEntry}
        onDeleteEntry={vi.fn()}
      />
    )
    await userEvent.click(screen.getByText('New Audit'))
    expect(onNewEntry).toHaveBeenCalledOnce()
  })

  it('shows item count per entry', () => {
    render(
      <NwEntryList
        entries={entries}
        currency="EUR"
        selectedEntryId={null}
        onSelectEntry={vi.fn()}
        onNewEntry={vi.fn()}
        onDeleteEntry={vi.fn()}
      />
    )
    const itemCounts = screen.getAllByText('1 item')
    expect(itemCounts.length).toBe(2)
  })

  it('highlights selected entry', () => {
    render(
      <NwEntryList
        entries={entries}
        currency="EUR"
        selectedEntryId="e1"
        onSelectEntry={vi.fn()}
        onNewEntry={vi.fn()}
        onDeleteEntry={vi.fn()}
      />
    )
    const selectedEntry = screen.getByText('2024-01-15').closest('div[class*="border"]')
    expect(selectedEntry).toHaveClass('border-nobleGold')
  })
})
