interface RecipeRatingInputProps {
    value: number | null
    onChange: (value: number | null) => void
    icon: React.ReactNode
    max?: number
}

export const RecipeRatingInput = ({ value, onChange, icon, max = 5 }: RecipeRatingInputProps) => {
    const handleClick = (level: number) => {
        onChange(value === level ? null : level)
    }

    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: max }, (_, i) => i + 1).map((level) => (
                <button
                    key={level}
                    type="button"
                    onClick={() => handleClick(level)}
                    className={`transition-opacity ${
                        value !== null && level <= value ? 'opacity-100' : 'opacity-25'
                    } hover:opacity-75`}
                >
                    {icon}
                </button>
            ))}
        </div>
    )
}
