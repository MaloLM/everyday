interface BudgetTagFilterProps {
    tags: string[]
    activeTag: string | null
    onTagClick: (tag: string | null) => void
}

export const BudgetTagFilter = ({ tags, activeTag, onTagClick }: BudgetTagFilterProps) => {
    if (tags.length === 0) return null

    return (
        <div className="flex flex-wrap gap-2">
            <button
                type="button"
                onClick={() => onTagClick(null)}
                className={`rounded-full px-3 py-1 text-sm transition-colors ${
                    activeTag === null
                        ? 'bg-nobleGold text-nobleBlack'
                        : 'border border-nobleGold/40 text-nobleGold/70 hover:border-nobleGold hover:text-nobleGold'
                }`}
            >
                All
            </button>
            {tags.map((tag) => (
                <button
                    key={tag}
                    type="button"
                    onClick={() => onTagClick(tag === activeTag ? null : tag)}
                    className={`rounded-full px-3 py-1 text-sm transition-colors ${
                        activeTag === tag
                            ? 'bg-nobleGold text-nobleBlack'
                            : 'border border-nobleGold/40 text-nobleGold/70 hover:border-nobleGold hover:text-nobleGold'
                    }`}
                >
                    {tag}
                </button>
            ))}
        </div>
    )
}
