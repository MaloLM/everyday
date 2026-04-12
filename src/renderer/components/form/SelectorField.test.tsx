import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { SelectorField } from './SelectorField'
import { renderWithFormik } from '../../../test/helpers'

describe('SelectorField', () => {
  it('renders a select with options', () => {
    renderWithFormik(<SelectorField name="currency" options={['EUR', 'USD', 'GBP']} />, {
      initialValues: { currency: 'EUR' },
    })
    const select = screen.getByRole('combobox')
    expect(select).toBeInTheDocument()
    expect(screen.getByText('EUR')).toBeInTheDocument()
    expect(screen.getByText('USD')).toBeInTheDocument()
    expect(screen.getByText('GBP')).toBeInTheDocument()
  })

  it('renders empty when no options provided', () => {
    renderWithFormik(<SelectorField name="currency" />, {
      initialValues: { currency: '' },
    })
    const select = screen.getByRole('combobox')
    expect(select.children).toHaveLength(0)
  })
})
