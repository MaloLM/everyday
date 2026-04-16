import { useState, useRef, useEffect } from 'react'

interface EaTagInputProps {
    value: string
    allTags: string[]
    onChange: (value: string) => void
}

export const EaTagInput = ({ value, allTags, onChange }: EaTagInputProps) => {
    const [open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState(value)
    const wrapperRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        setInputValue(value)
    }, [value])

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const suggestions = inputValue.trim() === ''
        ? allTags
        : allTags.filter((tag) => tag.toLowerCase().includes(inputValue.toLowerCase()) && tag !== inputValue)

    const handleSelect = (tag: string) => {
        setInputValue(tag)
        onChange(tag)
        setOpen(false)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value
        setInputValue(v)
        onChange(v)
        setOpen(true)
    }

    return (
        <div ref={wrapperRef} className="relative">
            <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onFocus={() => setOpen(true)}
                placeholder="tag"
                className="field w-28 bg-transparent px-1 py-0.5 text-sm text-softWhite/80"
                maxLength={30}
            />
            {open && suggestions.length > 0 && (
                <div className="absolute left-0 top-full z-20 mt-1 max-h-40 w-40 overflow-y-auto rounded-lg border border-white/10 bg-lightNobleBlack shadow-lg">
                    {suggestions.map((tag) => (
                        <button
                            key={tag}
                            type="button"
                            onClick={() => handleSelect(tag)}
                            className="block w-full px-3 py-1.5 text-left text-xs text-softWhite/70 transition-colors hover:bg-nobleGold/10 hover:text-nobleGold"
                        >
                            {tag}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
