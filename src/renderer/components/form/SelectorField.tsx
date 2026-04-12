import { Field } from 'formik'

interface SelectorFieldProps {
    name?: string
    title?: string
    className?: string
    options?: string[]
}

export const SelectorField = ({ name, className, options, title }: SelectorFieldProps) => {
    return (
        <Field titre={title} name={name} as="select" className={'field border-transparent ' + className}>
            {options?.map((option, index) => <option key={index}>{option}</option>)}
        </Field>
    )
}
