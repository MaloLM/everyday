import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TextField } from './TextField'
import { renderWithFormik } from '../../../test/helpers'

describe('TextField', () => {
  it('renders a text input', () => {
    renderWithFormik(<TextField name="name" />, {
      initialValues: { name: '' },
    })
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('accepts text input', async () => {
    renderWithFormik(<TextField name="name" />, {
      initialValues: { name: '' },
    })
    const input = screen.getByRole('textbox')
    await userEvent.type(input, 'Bitcoin')
    expect(input).toHaveValue('Bitcoin')
  })

  it('renders tooltip as title', () => {
    renderWithFormik(<TextField name="name" tooltip="Enter name" />, {
      initialValues: { name: '' },
    })
    expect(screen.getByRole('textbox')).toHaveAttribute('title', 'Enter name')
  })
})
