import { ErrorMessage, Field } from 'formik'
import { ReactNode } from 'react'

interface TextFieldProps {
    children?: ReactNode
    name?: string
    tooltip?: string
    displayError?: boolean
    className?: string
}

export const TextField = (props: TextFieldProps) => {
    return (
        <Field name={props.name}>
            {({ field, meta }) => (
                <div className="flex flex-col">
                    <input
                        className={`field 
                        ${meta.touched && meta.error ? ' border-error ' : ' border-transparent '} 
                        ${props.className}`}
                        type="text"
                        title={props.tooltip}
                        {...field}
                    />
                    {props.displayError && meta.touched && meta.error && (
                        <ErrorMessage name={props.name || 'field'} component="div" className="text-xs text-error" />
                    )}
                </div>
            )}
        </Field>
    )
}
