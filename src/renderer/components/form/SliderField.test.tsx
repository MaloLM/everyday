import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { SliderField } from './SliderField'
import { renderWithFormik } from '../../../test/helpers'

describe('SliderField', () => {
  it('renders a range input and a number field', () => {
    renderWithFormik(<SliderField name="target" />, {
      initialValues: { target: 50 },
    })
    expect(screen.getByRole('slider')).toBeInTheDocument()
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('applies min and max to the range input', () => {
    renderWithFormik(<SliderField name="target" min={0} max={100} />, {
      initialValues: { target: 50 },
    })
    const slider = screen.getByRole('slider')
    expect(slider).toHaveAttribute('min', '0')
    expect(slider).toHaveAttribute('max', '100')
  })

  it('shows % currency symbol', () => {
    renderWithFormik(<SliderField name="target" />, {
      initialValues: { target: 50 },
    })
    expect(screen.getByText('%')).toBeInTheDocument()
  })
})
