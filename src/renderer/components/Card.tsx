import { ReactNode } from 'react'

interface CardProps {
    title?: string
    children?: ReactNode
    className?: string
    titleButton?: ReactNode
}

export const Card = (props: CardProps) => {
    return (
        <div className={` flex flex-col gap-5 rounded-xl bg-lightNobleBlack p-9 ${props.className}   `}>
            {props.title && (
                <div className="flex items-center gap-3">
                    <h1 className="font-serif text-3xl  font-medium tracking-wider text-nobleGold subpixel-antialiased ">
                        {props.title}
                    </h1>
                    {props.titleButton && props.titleButton}
                </div>
            )}
            <div>{props.children}</div>
        </div>
    )
}
