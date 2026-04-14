import { ErrorMessage, Field } from 'formik'
import { ComponentType, InputHTMLAttributes } from 'react'

interface NumberFieldProps {
    name?: string
    tooltip?: string
    placeholder?: string
    className?: string
    currency?: string
    displayError?: boolean
    allowNegative?: boolean
    inputElement?: ComponentType<InputHTMLAttributes<HTMLInputElement>>
}

export const NumberField = (props: NumberFieldProps) => {
    return (
        <Field name={props.name}>
            {({ field, meta }) => (
                <div className={`flex flex-col`}>
                    {props.inputElement ? (
                        <props.inputElement {...field} />
                    ) : (
                        <>
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    {...field}
                                    onChange={(e) => {
                                        let value = e.target.value
                                        const pattern = props.allowNegative ? /^-?\d*\.?\d*$/ : /^\d*\.?\d*$/
                                        if (pattern.test(value) || value === '') {
                                            if (props.allowNegative) {
                                                const stripped = value.startsWith('-') ? '-' + value.slice(1).replace(/^0+(?=\d)/, '') : value.replace(/^0+(?=\d)/, '')
                                                e.target.value = stripped
                                            } else if (value !== '0' && !value.startsWith('0.')) {
                                                e.target.value = value.replace(/^0+/, '')
                                            }
                                            field.onChange(e)
                                        }
                                    }}
                                    title={props.tooltip}
                                    placeholder={props.placeholder}
                                    className={`field relative max-w-14 text-center ${props.currency && props.currency !== '%' ? 'fin-value' : ''}
                                ${meta.touched && meta.error ? ' border-error ' : ' border-transparent '} ${props.className}`}
                                ></input>
                                {props.currency && (
                                    <span className={` flex items-center text-softWhite opacity-50`}>
                                        {props.currency}
                                    </span>
                                )}
                            </div>
                            {props.displayError && meta.touched && meta.error && (
                                <ErrorMessage
                                    name={props.name || 'field'}
                                    component="div"
                                    className="text-xs text-error"
                                />
                            )}
                        </>
                    )}
                </div>
            )}
        </Field>
    )
}
