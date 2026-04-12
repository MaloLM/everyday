import { useRef } from 'react'
import { Plus } from 'lucide-react'
import { RecipeTool } from '../../../utils/types'
import { RecipeToolForm } from './RecipeToolForm'
import toast from 'react-hot-toast'

const MAX_TOOLS = 50

interface RecipeToolListProps {
    tools: RecipeTool[]
    onChange: (tools: RecipeTool[]) => void
    errors?: any
}

export const RecipeToolList = ({ tools, onChange, errors }: RecipeToolListProps) => {
    const lastRef = useRef<HTMLDivElement>(null)

    const addTool = () => {
        if (tools.length >= MAX_TOOLS) {
            toast.error('Maximum number of tools reached')
            return
        }
        onChange([
            ...tools,
            { id: crypto.randomUUID(), name: '' },
        ])
        requestAnimationFrame(() => {
            lastRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
        })
    }

    const handleChange = (index: number, value: string) => {
        const updated = [...tools]
        updated[index] = { ...updated[index], name: value }
        onChange(updated)
    }

    const handleDelete = (index: number) => {
        onChange(tools.filter((_, i) => i !== index))
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex max-h-[14rem] flex-col gap-1 overflow-y-auto py-1 pr-1">
                {tools.map((tool, index) => (
                    <div key={tool.id} ref={index === tools.length - 1 ? lastRef : undefined}>
                        <RecipeToolForm
                            tool={tool}
                            index={index}
                            onChange={handleChange}
                            onDelete={handleDelete}
                            hasError={errors?.[index]}
                        />
                    </div>
                ))}
                {tools.length === 0 && (
                    <div className="flex h-12 items-center justify-center">
                        <p className="text-sm text-softWhite/50">No tools added</p>
                    </div>
                )}
            </div>
            <button
                type="button"
                onClick={addTool}
                className="flex items-center gap-1 self-start rounded-lg border border-nobleGold/30 px-3 py-1 text-sm text-nobleGold transition-colors hover:bg-nobleGold/10"
            >
                <Plus size={14} /> Add tool
            </button>
        </div>
    )
}
