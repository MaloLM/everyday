import { NumberField } from '../NumberField'

interface SpMonthCellsProps {
    index: number
    months: string[]
    currencySymbol: string
}

export const SpMonthCells = ({ index, months, currencySymbol }: SpMonthCellsProps) => {
    return (
        <>
            {months.map((month) => (
                <td key={month} className="px-1 py-1">
                    <NumberField
                        name={`projects[${index}].monthlyContributions.${month}`}
                        placeholder="0"
                        currency={currencySymbol}
                        allowNegative
                        className="!max-w-20"
                    />
                </td>
            ))}
        </>
    )
}
