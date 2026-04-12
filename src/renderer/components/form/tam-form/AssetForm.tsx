import { NumberField, TextField, SliderField } from '..'
import { X } from 'lucide-react'

interface AssetFormProps {
    assetIndex?: number
    onDelete?: () => void
    error?: boolean
    currency?: string
    className?: string
}

export const AssetForm = (props: AssetFormProps) => {
    return (
        <div
            className={`bg-secondaryLightNobleBlack relative flex items-center justify-between rounded-lg  border
        py-2 pb-2 pl-2 pr-8  shadow-xl transition-all duration-500 ease-in-out
        ${
            props.error
                ? 'border-error border-opacity-100'
                : 'scale-95  border-nobleBlack border-opacity-100 hover:scale-100'
        } 
        ${props.className}`}
        >
            <NumberField
                className="mx-2 font-bold "
                name={`assets[${props.assetIndex}].quantityOwned`}
                tooltip="Quantity Owned"
            />
            <div className="flex w-full flex-col">
                <div className="flex ">
                    <TextField name={`assets[${props.assetIndex}].assetName`} tooltip="Asset Name" />
                    <NumberField
                        name={`assets[${props.assetIndex}].unitPrice`}
                        tooltip="Unit Price"
                        currency={props.currency}
                    />
                </div>
                <div className="flex">
                    <SliderField
                        max={100}
                        min={0}
                        tooltip="Target %"
                        name={`assets[${props.assetIndex}].targetPercent`}
                    />
                </div>
            </div>
            <button className="absolute  right-0 top-0 m-1  border-0 p-0.5" type="button" onClick={props.onDelete}>
                <X className=" opacity-30 hover:text-error hover:opacity-100" size={'20'} />
            </button>
        </div>
    )
}
