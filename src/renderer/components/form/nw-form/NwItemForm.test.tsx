import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { NwItemForm } from './NwItemForm'
import { renderWithFormik } from '../../../../test/helpers'

const defaultValues = {
  items: [{ id: '1', name: 'Savings', estimatedValue: 5000 }],
}

describe('NwItemForm', () => {
  it('renders item fields', () => {
    renderWithFormik(<NwItemForm itemIndex={0} onDelete={() => {}} currency="$" />, {
      initialValues: defaultValues,
    })
    const inputs = screen.getAllByRole('textbox')
    expect(inputs.length).toBeGreaterThanOrEqual(2) // name + value
  })

  it('renders delete button', () => {
    renderWithFormik(<NwItemForm itemIndex={0} onDelete={() => {}} />, {
      initialValues: defaultValues,
    })
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('shows error border when error prop is true', () => {
    const { container } = renderWithFormik(
      <NwItemForm itemIndex={0} onDelete={() => {}} error />,
      { initialValues: defaultValues }
    )
    const wrapper = container.querySelector('.border-error')
    expect(wrapper).toBeInTheDocument()
  })

  it('shows currency symbol', () => {
    renderWithFormik(<NwItemForm itemIndex={0} onDelete={() => {}} currency="$" />, {
      initialValues: defaultValues,
    })
    expect(screen.getByText('$')).toBeInTheDocument()
  })
})
