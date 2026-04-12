import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { LineChart } from './LineChart'

describe('LineChart', () => {
  it('renders without crashing with valid data', () => {
    const chartData = {
      labels: ['2024-01-01', '2024-02-01'],
      datasets: [
        {
          label: 'Net Worth',
          data: [10000, 12000],
        },
      ],
    }
    const { container } = render(
      <LineChart chartData={chartData} label={(ctx) => ctx.raw} title="Test" />
    )
    expect(container.querySelector('canvas')).toBeInTheDocument()
  })
})
