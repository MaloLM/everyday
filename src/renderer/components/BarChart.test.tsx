import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { BarChart } from './BarChart'
import { MOCK_CHART_DATA } from '../utils'

describe('BarChart', () => {
  it('renders without crashing with valid data', () => {
    const { container } = render(
      <BarChart
        chartData={MOCK_CHART_DATA}
        label={(ctx) => ctx.raw}
        title="Test Chart"
      />
    )
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })
})
