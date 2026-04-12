import { NumberField, TextField } from '..'
import { X } from 'lucide-react'

interface NwItemFormProps {
    itemIndex: number
    onDelete: () => void
    error?: boolean
    currency?: string
}

export const NwItemForm = (props: NwItemFormProps) => {
    return (
        <div
            className={`bg-secondaryLightNobleBlack relative flex items-center justify-between rounded-lg border
            py-2 pb-2 pl-2 pr-8 shadow-xl
            ${
                props.error
                    ? 'border-error border-opacity-100'
                    : 'border-nobleBlack border-opacity-100 hover:border-opacity-40'
            }`}
        >
            <div className="flex w-full items-center gap-2">
                <TextField name={`items[${props.itemIndex}].name`} tooltip="Item Name" />
                <NumberField
                    name={`items[${props.itemIndex}].estimatedValue`}
                    tooltip="Estimated Value"
                    currency={props.currency}
                    allowNegative
                    className="mx-2 font-bold"
                />
            </div>
            <button className="absolute right-0 top-0 m-1 border-0 p-0.5" type="button" onClick={props.onDelete}>
                <X className="opacity-30 hover:text-error hover:opacity-100" size={'20'} />
            </button>
        </div>
    )
}
