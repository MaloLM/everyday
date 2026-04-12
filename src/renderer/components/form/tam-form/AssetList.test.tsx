import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AssetList } from './AssetList'
import { renderWithFormik } from '../../../../test/helpers'

const defaultValues = {
  assets: [
    { id: '1', assetName: 'BTC', unitPrice: 100, quantityOwned: 2, targetPercent: 60 },
    { id: '2', assetName: 'ETH', unitPrice: 50, quantityOwned: 5, targetPercent: 40 },
  ],
  budget: 1000,
  currency: 'EUR',
}

describe('AssetList', () => {
  it('renders all assets', () => {
    const setFieldValue = vi.fn()
    renderWithFormik(
      <AssetList values={defaultValues} errors={{}} setFieldValue={setFieldValue} />,
      { initialValues: defaultValues }
    )
    // Each asset has a delete button
    const deleteButtons = screen.getAllByRole('button').filter((b) => !b.textContent?.includes('Asset'))
    expect(deleteButtons.length).toBe(2)
  })

  it('shows "No assets added" when list is empty', () => {
    const emptyValues = { ...defaultValues, assets: [] }
    renderWithFormik(
      <AssetList values={emptyValues} errors={{}} setFieldValue={vi.fn()} />,
      { initialValues: emptyValues }
    )
    expect(screen.getByText('No assets added')).toBeInTheDocument()
  })

  it('has an Add Asset button', () => {
    renderWithFormik(
      <AssetList values={defaultValues} errors={{}} setFieldValue={vi.fn()} />,
      { initialValues: defaultValues }
    )
    expect(screen.getByText('Asset')).toBeInTheDocument()
  })

  it('calls setFieldValue when Add Asset is clicked', async () => {
    const setFieldValue = vi.fn()
    renderWithFormik(
      <AssetList values={defaultValues} errors={{}} setFieldValue={setFieldValue} />,
      { initialValues: defaultValues }
    )
    await userEvent.click(screen.getByText('Asset'))
    expect(setFieldValue).toHaveBeenCalledWith('assets', expect.arrayContaining([
      expect.objectContaining({ assetName: 'Asset Name' }),
    ]))
  })
})
