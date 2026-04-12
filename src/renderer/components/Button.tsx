import { ReactNode } from 'react'

interface ButtonProps {
    onClick?: () => void
    children?: ReactNode
    className?: string
    filled?: boolean
    disabled?: boolean
    title?: string
    type?: 'button' | 'submit' | 'reset'
}

export const Button = (props: ButtonProps) => {
    return (
        <button
            title={props.title}
            disabled={props.disabled}
            type={props.type ? props.type : 'button'}
            className={` rounded-full border px-2
        ${
            props.filled
                ? 'border-nobleGold bg-nobleGold text-lightNobleBlack transition-transform duration-700 hover:scale-105 hover:bg-nobleGold hover:brightness-110 '
                : ` relative flex  
                    items-center justify-center overflow-hidden border-nobleGold text-nobleGold transition-all before:absolute before:h-0 before:w-0 before:rounded-full before:bg-nobleGold before:duration-300 before:ease-in 
                    hover:bg-lightNobleBlack hover:text-lightNobleBlack hover:before:h-32 hover:before:w-32`
        } 
                    ${props.className}`}
            onClick={props.onClick}
        >
            <div className="z-30 flex items-center justify-center">{props.children}</div>
        </button>
    )
}
