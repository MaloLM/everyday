import { NumberField, TextField } from '..'
import { X } from 'lucide-react'

interface BudgetIncomeFormProps {
    itemIndex: number
    onDelete: () => void
    error?: boolean
    currency?: string
}

export const BudgetIncomeForm = (props: BudgetIncomeFormProps) => {
    return (
        <div
            className={`relative flex items-center gap-2 rounded-lg border
            py-2 pl-2 pr-8 shadow-xl
            ${
                props.error
                    ? 'border-error border-opacity-100'
                    : 'border-nobleBlack border-opacity-100 hover:border-opacity-40'
            }`}
        >
            <TextField
                name={`incomes[${props.itemIndex}].label`}
                tooltip="Label"
                placeholder="Label"
                className="min-w-0 flex-[3]"
            />
            <NumberField
                name={`incomes[${props.itemIndex}].value`}
                tooltip="Amount"
                placeholder="0"
                currency={props.currency}
                className="w-24 shrink-0"
            />
            <NumberField
                name={`incomes[${props.itemIndex}].deductionRate`}
                tooltip="Deduction rate"
                placeholder="0"
                currency="%"
                className="w-20 shrink-0"
            />
            <TextField
                name={`incomes[${props.itemIndex}].tag`}
                tooltip="Tag"
                placeholder="Tag"
                className="w-24 shrink-0"
            />
            <button className="absolute right-0 top-0 m-1 border-0 p-0.5" type="button" onClick={props.onDelete}>
                <X className="opacity-30 hover:text-error hover:opacity-100" size={'20'} />
            </button>
        </div>
    )
}
