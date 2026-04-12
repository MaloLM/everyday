import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { AssetForm } from './AssetForm'
import { renderWithFormik } from '../../../../test/helpers'

const defaultValues = {
  assets: [{ id: '1', assetName: 'BTC', unitPrice: 100, quantityOwned: 2, targetPercent: 50 }],
}

describe('AssetForm', () => {
  it('renders asset fields', () => {
    renderWithFormik(<AssetForm assetIndex={0} currency="$" />, {
      initialValues: defaultValues,
    })
    const inputs = screen.getAllByRole('textbox')
    expect(inputs.length).toBeGreaterThanOrEqual(2) // name + price + quantity fields
  })

  it('renders delete button', () => {
    renderWithFormik(<AssetForm assetIndex={0} onDelete={() => {}} />, {
      initialValues: defaultValues,
    })
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('shows error border when error prop is true', () => {
    const { container } = renderWithFormik(<AssetForm assetIndex={0} error />, {
      initialValues: defaultValues,
    })
    const wrapper = container.querySelector('.border-error')
    expect(wrapper).toBeInTheDocument()
  })

  it('shows currency symbol', () => {
    renderWithFormik(<AssetForm assetIndex={0} currency="$" />, {
      initialValues: defaultValues,
    })
    expect(screen.getByText('$')).toBeInTheDocument()
  })

  it('renders slider for target percent', () => {
    renderWithFormik(<AssetForm assetIndex={0} />, {
      initialValues: defaultValues,
    })
    expect(screen.getByRole('slider')).toBeInTheDocument()
  })
})
