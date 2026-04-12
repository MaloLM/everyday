import { NumberField, TextField, SelectorField } from '..'
import { X } from 'lucide-react'
import { RECURRENCE_UNITS, CURRENCIES, computeAnnualCost, RecurringPurchaseItem } from '../../../utils'
import { useFormikContext } from 'formik'

interface RpItemFormProps {
    itemIndex: number
    onDelete: () => void
    error?: boolean
    currency?: string
}

export const RpItemForm = (props: RpItemFormProps) => {
    const { values } = useFormikContext<{ items: RecurringPurchaseItem[] }>()
    const item = values.items[props.itemIndex]
    const annual = item ? computeAnnualCost({
        ...item,
        unitPrice: Number(item.unitPrice) || 0,
        quantity: Number(item.quantity) || 0,
        recurrence: { every: Number(item.recurrence?.every) || 1, unit: item.recurrence?.unit || 'month' },
    }) : 0

    return (
        <div
            className={`bg-secondaryLightNobleBlack relative flex items-center gap-2 rounded-lg border
            py-2 pl-2 pr-8 shadow-xl flex-wrap
            ${
                props.error
                    ? 'border-error border-opacity-100'
                    : 'border-nobleBlack border-opacity-100 hover:border-opacity-40'
            }`}
        >
            <TextField
                name={`items[${props.itemIndex}].emoji`}
                tooltip="Emoji"
                placeholder="🛒"
                className="w-10 text-center"
            />
            <TextField
                name={`items[${props.itemIndex}].name`}
                tooltip="Name"
                placeholder="Name"
                className="min-w-24 flex-1"
            />
            <NumberField
                name={`items[${props.itemIndex}].unitPrice`}
                tooltip="Unit Price"
                placeholder="Price"
                currency={props.currency}
                className="w-24"
            />
            <div className="flex items-center gap-1 text-xs text-softWhite/50">
                <span>×</span>
            </div>
            <NumberField
                name={`items[${props.itemIndex}].quantity`}
                tooltip="Qty"
                placeholder="Qty"
                className="w-16"
            />
            <div className="flex items-center gap-1 text-xs text-softWhite/50">
                <span>every</span>
            </div>
            <NumberField
                name={`items[${props.itemIndex}].recurrence.every`}
                tooltip="Every"
                placeholder="1"
                className="w-16"
            />
            <SelectorField
                name={`items[${props.itemIndex}].recurrence.unit`}
                options={[...RECURRENCE_UNITS]}
                className="w-20 text-sm"
            />
            <TextField
                name={`items[${props.itemIndex}].tag`}
                tooltip="Tag"
                placeholder="Tag"
                className="w-24"
            />
            <div className="ml-auto flex items-center text-sm font-medium text-nobleGold whitespace-nowrap">
                {annual.toLocaleString(undefined, { maximumFractionDigits: 0 })} {props.currency}/yr
            </div>
            <button className="absolute right-0 top-0 m-1 border-0 p-0.5" type="button" onClick={props.onDelete}>
                <X className="opacity-30 hover:text-error hover:opacity-100" size={'20'} />
            </button>
        </div>
    )
}
