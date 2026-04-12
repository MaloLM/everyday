import { HelpCircle } from 'lucide-react'

interface LearnMoreProps {
    message: string
    buttonClassName?: string
    tooltipClassName?: string
}

export const HelpButton = ({ buttonClassName, tooltipClassName, message }: LearnMoreProps) => {
    return (
        <div className="group relative flex justify-center">
            <button className={`rounded  text-nobleGold ${buttonClassName}`}>
                <HelpCircle />
            </button>
            <span
                className={`absolute top-7 z-50 scale-0 text-wrap rounded bg-nobleBlack p-2 text-justify text-xs group-hover:scale-100 ${tooltipClassName}`}
            >
                {message}
            </span>
        </div>
    )
}
