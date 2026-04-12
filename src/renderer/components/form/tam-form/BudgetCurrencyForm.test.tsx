import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { BudgetCurrencyForm } from './BudgetCurrencyForm'
import { renderWithFormik } from '../../../../test/helpers'
import { TamFormResponse } from '../../../../renderer/utils'

describe('BudgetCurrencyForm', () => {
  it('renders budget field and currency selector', () => {
    renderWithFormik(
      <BudgetCurrencyForm computeResult={{} as TamFormResponse} handleUpdate={vi.fn()} />,
      { initialValues: { budget: 1000, currency: 'EUR' } }
    )
    expect(screen.getByText('Budget')).toBeInTheDocument()
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('shows recompute and update buttons when computeResult has assets', () => {
    const result: TamFormResponse = {
      assets: [{ assetName: 'BTC', unitPrice: 100, oldQuantity: 1, newQuantity: 2, additionalQuantity: 1, assetProp: 50, newProp: 55 }],
    }
    renderWithFormik(
      <BudgetCurrencyForm computeResult={result} handleUpdate={vi.fn()} />,
      { initialValues: { budget: 1000, currency: 'EUR' } }
    )
    expect(screen.getByText('Update Config')).toBeInTheDocument()
  })

  it('does not show update buttons when no results', () => {
    renderWithFormik(
      <BudgetCurrencyForm computeResult={{} as TamFormResponse} handleUpdate={vi.fn()} />,
      { initialValues: { budget: 1000, currency: 'EUR' } }
    )
    expect(screen.queryByText('Update Config')).not.toBeInTheDocument()
  })
})
