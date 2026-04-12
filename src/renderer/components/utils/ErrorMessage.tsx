import { AlertCircle } from 'lucide-react'

export const ErrorMessages = ({ errorMessages }) => {
    return (
        <div className="flex rounded-lg border border-error bg-transparent p-3 text-error ">
            <AlertCircle className="mr-2" />
            <div className="flex flex-col">
                {errorMessages.map((message, index) => (
                    <p key={index} className="text-error">
                        {message}
                    </p>
                ))}
            </div>
        </div>
    )
}
