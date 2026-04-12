import { Bold, Italic, Heading2, List, ListOrdered, Link } from 'lucide-react'
import { RefObject } from 'react'

interface RecipeMarkdownToolbarProps {
    textareaRef: RefObject<HTMLTextAreaElement | null>
    value: string
    onChange: (value: string) => void
}

type FormatAction = {
    icon: React.ReactNode
    label: string
    apply: (text: string, start: number, end: number) => { text: string; cursor: number }
}

const actions: FormatAction[] = [
    {
        icon: <Bold size={15} />,
        label: 'Bold',
        apply: (text, start, end) => {
            const selected = text.slice(start, end)
            const replacement = `**${selected || 'bold'}**`
            return {
                text: text.slice(0, start) + replacement + text.slice(end),
                cursor: selected ? start + replacement.length : start + 2,
            }
        },
    },
    {
        icon: <Italic size={15} />,
        label: 'Italic',
        apply: (text, start, end) => {
            const selected = text.slice(start, end)
            const replacement = `*${selected || 'italic'}*`
            return {
                text: text.slice(0, start) + replacement + text.slice(end),
                cursor: selected ? start + replacement.length : start + 1,
            }
        },
    },
    {
        icon: <Heading2 size={15} />,
        label: 'Heading',
        apply: (text, start, end) => {
            const lineStart = text.lastIndexOf('\n', start - 1) + 1
            const prefix = '## '
            const newText = text.slice(0, lineStart) + prefix + text.slice(lineStart)
            return {
                text: newText,
                cursor: end + prefix.length,
            }
        },
    },
    {
        icon: <List size={15} />,
        label: 'Bullet list',
        apply: (text, start, end) => {
            const lineStart = text.lastIndexOf('\n', start - 1) + 1
            const prefix = '- '
            const newText = text.slice(0, lineStart) + prefix + text.slice(lineStart)
            return {
                text: newText,
                cursor: end + prefix.length,
            }
        },
    },
    {
        icon: <ListOrdered size={15} />,
        label: 'Numbered list',
        apply: (text, start, end) => {
            const lineStart = text.lastIndexOf('\n', start - 1) + 1
            const prefix = '1. '
            const newText = text.slice(0, lineStart) + prefix + text.slice(lineStart)
            return {
                text: newText,
                cursor: end + prefix.length,
            }
        },
    },
    {
        icon: <Link size={15} />,
        label: 'Link',
        apply: (text, start, end) => {
            const selected = text.slice(start, end)
            const replacement = `[${selected || 'text'}](url)`
            return {
                text: text.slice(0, start) + replacement + text.slice(end),
                cursor: selected ? start + selected.length + 3 : start + 1,
            }
        },
    },
]

export const RecipeMarkdownToolbar = ({ textareaRef, value, onChange }: RecipeMarkdownToolbarProps) => {
    const handleAction = (action: FormatAction) => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const result = action.apply(value, start, end)

        onChange(result.text)
        requestAnimationFrame(() => {
            textarea.focus()
            textarea.setSelectionRange(result.cursor, result.cursor)
        })
    }

    return (
        <div className="flex items-center gap-1 rounded-t-lg border border-b-0 border-lightGray bg-lightNobleBlack px-2 py-1.5">
            {actions.map((action) => (
                <button
                    key={action.label}
                    type="button"
                    onClick={() => handleAction(action)}
                    title={action.label}
                    className="rounded p-1 text-softWhite/60 transition-colors hover:bg-nobleGold/10 hover:text-nobleGold"
                >
                    {action.icon}
                </button>
            ))}
        </div>
    )
}
