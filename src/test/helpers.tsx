import { render } from '@testing-library/react'
import { Formik, Form } from 'formik'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'

interface FormikWrapperOptions {
  initialValues: Record<string, any>
  validationSchema?: any
  onSubmit?: (...args: any[]) => void
}

export function renderWithFormik(
  ui: React.ReactElement,
  { initialValues, validationSchema, onSubmit = vi.fn() }: FormikWrapperOptions
) {
  return render(
    <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={onSubmit}>
      <Form>{ui}</Form>
    </Formik>
  )
}

export function renderWithRouter(ui: React.ReactElement, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>
      {ui}
    </MemoryRouter>
  )
}
