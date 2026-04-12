import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NumberField } from './NumberField'
import { renderWithFormik } from '../../../test/helpers'

describe('NumberField', () => {
  it('renders an input', () => {
    renderWithFormik(<NumberField name="price" />, {
      initialValues: { price: '' },
    })
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('accepts numeric input', async () => {
    renderWithFormik(<NumberField name="price" />, {
      initialValues: { price: '' },
    })
    const input = screen.getByRole('textbox')
    await userEvent.type(input, '123')
    expect(input).toHaveValue('123')
  })

  it('rejects non-numeric input', async () => {
    renderWithFormik(<NumberField name="price" />, {
      initialValues: { price: '' },
    })
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'abc')
    expect(input).toHaveValue('')
  })

  it('displays currency symbol when provided', () => {
    renderWithFormik(<NumberField name="price" currency="$" />, {
      initialValues: { price: '100' },
    })
    expect(screen.getByText('$')).toBeInTheDocument()
  })

  it('allows negative values when allowNegative is true', async () => {
    renderWithFormik(<NumberField name="value" allowNegative />, {
      initialValues: { value: '' },
    })
    const input = screen.getByRole('textbox')
    await userEvent.type(input, '-50')
    expect(input).toHaveValue('-50')
  })
})
