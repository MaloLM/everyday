import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NwItemList } from './NwItemList'
import { renderWithFormik } from '../../../../test/helpers'

const defaultValues = {
  items: [
    { id: '1', name: 'Savings', estimatedValue: 5000 },
    { id: '2', name: 'Stocks', estimatedValue: 10000 },
  ],
  currency: 'EUR',
}

describe('NwItemList', () => {
  it('renders all items', () => {
    renderWithFormik(
      <NwItemList values={defaultValues} errors={{}} setFieldValue={vi.fn()} />,
      { initialValues: defaultValues }
    )
    const deleteButtons = screen.getAllByRole('button').filter((b) => !b.textContent?.includes('Item'))
    expect(deleteButtons.length).toBe(2)
  })

  it('shows "No items added" when list is empty', () => {
    const emptyValues = { ...defaultValues, items: [] }
    renderWithFormik(
      <NwItemList values={emptyValues} errors={{}} setFieldValue={vi.fn()} />,
      { initialValues: emptyValues }
    )
    expect(screen.getByText('No items added')).toBeInTheDocument()
  })

  it('has an Add Item button', () => {
    renderWithFormik(
      <NwItemList values={defaultValues} errors={{}} setFieldValue={vi.fn()} />,
      { initialValues: defaultValues }
    )
    expect(screen.getByText('Item')).toBeInTheDocument()
  })

  it('calls setFieldValue when Add Item is clicked', async () => {
    const setFieldValue = vi.fn()
    renderWithFormik(
      <NwItemList values={defaultValues} errors={{}} setFieldValue={setFieldValue} />,
      { initialValues: defaultValues }
    )
    await userEvent.click(screen.getByText('Item'))
    expect(setFieldValue).toHaveBeenCalledWith('items', expect.arrayContaining([
      expect.objectContaining({ name: 'Item Name' }),
    ]))
  })
})
