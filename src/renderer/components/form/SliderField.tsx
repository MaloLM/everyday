import { Field } from 'formik'
import { NumberField } from './NumberField'

interface SliderFieldProps {
    name?: string
    withLabel?: boolean
    tooltip?: string
    min?: number
    max?: number
    className?: string
}

export const SliderField = (props: SliderFieldProps) => {
    return (
        <Field name={props.name}>
            {({ field }) => (
                <div className={'flex w-full items-center ' + props.className}>
                    <div className={'relative w-3/4 ' + (props.withLabel ? 'mb-6' : '')}>
                        <input
                            title={props.tooltip}
                            {...field}
                            type="range"
                            min={props.min || 0}
                            max={props.max || 100}
                            className="h-2 w-full  cursor-pointer rounded-lg accent-nobleGold"
                        />
                    </div>
                    <NumberField
                        tooltip={props.tooltip}
                        name={props.name}
                        className="max-w-9 text-center "
                        currency="%"
                    />
                </div>
            )}
        </Field>
    )
}

export default SliderField
