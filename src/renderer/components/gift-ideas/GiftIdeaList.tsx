import { useState } from 'react'
import { ChevronDown, ChevronUp, Pencil, Plus, Search, Trash2, X, Check } from 'lucide-react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { GiftIdea } from '../../utils/types'
import { ConfirmModal } from '../ConfirmModal'

interface GiftIdeaListProps {
    ideas: GiftIdea[]
    onSave: (idea: GiftIdea) => void
    onDelete: (ideaId: string) => void
    onToggleOffered: (idea: GiftIdea) => void
}

export const GiftIdeaList = ({ ideas, onSave, onDelete, onToggleOffered }: GiftIdeaListProps) => {
    const [search, setSearch] = useState('')
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editTitle, setEditTitle] = useState('')
    const [editDetails, setEditDetails] = useState('')
    const [isAdding, setIsAdding] = useState(false)
    const [newTitle, setNewTitle] = useState('')
    const [newDetails, setNewDetails] = useState('')
    const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

    const pendingIdea = pendingDeleteId ? ideas.find((i) => i.id === pendingDeleteId) : null

    const filtered = ideas.filter((idea) => {
        const q = search.toLowerCase()
        return idea.title.toLowerCase().includes(q) || idea.details.toLowerCase().includes(q)
    })

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) next.delete(id)
            else next.add(id)
            return next
        })
    }

    const startEdit = (idea: GiftIdea) => {
        setEditingId(idea.id)
        setEditTitle(idea.title)
        setEditDetails(idea.details)
    }

    const cancelEdit = () => {
        setEditingId(null)
        setEditTitle('')
        setEditDetails('')
    }

    const saveEdit = (idea: GiftIdea) => {
        onSave({ ...idea, title: editTitle, details: editDetails })
        setEditingId(null)
        setExpandedIds((prev) => new Set(prev).add(idea.id))
    }

    const handleAdd = () => {
        const idea: GiftIdea = {
            id: crypto.randomUUID(),
            title: newTitle || 'New Idea',
            details: newDetails,
            offered: false,
        }
        onSave(idea)
        setIsAdding(false)
        setNewTitle('')
        setNewDetails('')
        setExpandedIds((prev) => new Set(prev).add(idea.id))
    }

    return (
        <div className="flex flex-col gap-4">
            <ConfirmModal
                isOpen={pendingDeleteId !== null}
                title="Delete Gift Idea"
                message={pendingIdea ? `Are you sure you want to delete "${pendingIdea.title || 'Untitled'}"? This action cannot be undone.` : ''}
                confirmLabel="Delete"
                onConfirm={() => { if (pendingDeleteId) { onDelete(pendingDeleteId); setPendingDeleteId(null) } }}
                onCancel={() => setPendingDeleteId(null)}
                danger
            />

            {/* Search + New */}
            <div className="flex items-center gap-3">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-softWhite/40" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search gift ideas..."
                        className="w-full rounded-lg border border-lightGray bg-lightNobleBlack py-2 pl-9 pr-3 text-sm text-softWhite placeholder-softWhite/30 focus:border-nobleGold/50 focus:outline-none"
                    />
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-1.5 rounded-lg border border-nobleGold/40 bg-nobleGold/10 px-4 py-2 text-sm font-medium text-nobleGold transition-colors hover:bg-nobleGold/20"
                >
                    <Plus size={16} /> New Idea
                </button>
            </div>

            {/* Add form */}
            {isAdding && (
                <div className="rounded-xl border border-nobleGold/30 bg-lightNobleBlack p-4">
                    <input
                        type="text"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Title"
                        autoFocus
                        className="mb-3 w-full rounded-lg border border-lightGray bg-nobleBlack px-3 py-2 text-sm text-softWhite placeholder-softWhite/30 focus:border-nobleGold/50 focus:outline-none"
                    />
                    <textarea
                        value={newDetails}
                        onChange={(e) => setNewDetails(e.target.value)}
                        placeholder="Details (markdown supported)"
                        rows={3}
                        className="mb-3 w-full resize-y rounded-lg border border-lightGray bg-nobleBlack px-3 py-2 text-sm text-softWhite placeholder-softWhite/30 focus:border-nobleGold/50 focus:outline-none"
                    />
                    <div className="flex gap-2">
                        <button
                            onClick={handleAdd}
                            className="flex items-center gap-1.5 rounded-lg bg-nobleGold/20 px-3 py-1.5 text-sm text-nobleGold transition-colors hover:bg-nobleGold/30"
                        >
                            <Check size={14} /> Add
                        </button>
                        <button
                            onClick={() => { setIsAdding(false); setNewTitle(''); setNewDetails('') }}
                            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-softWhite/50 transition-colors hover:text-softWhite"
                        >
                            <X size={14} /> Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Empty state */}
            {filtered.length === 0 && (
                <div className="flex h-40 items-center justify-center">
                    <p className="text-softWhite/50">
                        {ideas.length === 0 ? 'No gift ideas yet. Add your first one!' : 'No ideas match your search.'}
                    </p>
                </div>
            )}

            {/* Ideas list */}
            <div className="flex flex-col gap-2">
                {filtered.map((idea) => {
                    const isExpanded = expandedIds.has(idea.id)
                    const isEditing = editingId === idea.id

                    return (
                        <div
                            key={idea.id}
                            className="rounded-xl border border-lightGray bg-lightNobleBlack transition-all hover:border-nobleGold/20"
                        >
                            {isEditing ? (
                                <div className="p-4">
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        autoFocus
                                        className="mb-3 w-full rounded-lg border border-lightGray bg-nobleBlack px-3 py-2 text-sm text-softWhite placeholder-softWhite/30 focus:border-nobleGold/50 focus:outline-none"
                                    />
                                    <textarea
                                        value={editDetails}
                                        onChange={(e) => setEditDetails(e.target.value)}
                                        placeholder="Details (markdown supported)"
                                        rows={4}
                                        className="mb-3 w-full resize-y rounded-lg border border-lightGray bg-nobleBlack px-3 py-2 text-sm text-softWhite placeholder-softWhite/30 focus:border-nobleGold/50 focus:outline-none"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => saveEdit(idea)}
                                            className="flex items-center gap-1.5 rounded-lg bg-nobleGold/20 px-3 py-1.5 text-sm text-nobleGold transition-colors hover:bg-nobleGold/30"
                                        >
                                            <Check size={14} /> Save
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-softWhite/50 transition-colors hover:text-softWhite"
                                        >
                                            <X size={14} /> Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div
                                        className="flex cursor-pointer items-center gap-3 px-4 py-3"
                                        onClick={() => toggleExpand(idea.id)}
                                    >
                                        {/* Offered checkbox */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onToggleOffered(idea) }}
                                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                                                idea.offered
                                                    ? 'border-nobleGold/60 bg-nobleGold/20 text-nobleGold'
                                                    : 'border-softWhite/30 hover:border-nobleGold/40'
                                            }`}
                                            title={idea.offered ? 'Mark as not offered' : 'Mark as offered'}
                                        >
                                            {idea.offered && <Check size={12} />}
                                        </button>

                                        {/* Title */}
                                        <h3 className={`flex-1 font-serif text-base font-medium tracking-wide ${
                                            idea.offered ? 'text-softWhite/40 line-through' : 'text-nobleGold'
                                        }`}>
                                            {idea.title || 'Untitled'}
                                        </h3>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); startEdit(idea) }}
                                                className="rounded p-1 text-softWhite/30 transition-colors hover:text-nobleGold"
                                                title="Edit"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setPendingDeleteId(idea.id) }}
                                                className="rounded p-1 text-softWhite/30 transition-colors hover:text-error"
                                                title="Delete"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                            {isExpanded ? (
                                                <ChevronUp size={16} className="text-softWhite/40" />
                                            ) : (
                                                <ChevronDown size={16} className="text-softWhite/40" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Expanded details */}
                                    {isExpanded && idea.details && (
                                        <div className="border-t border-white/5 px-4 py-3">
                                            <div className="prose-recipe">
                                                <Markdown remarkPlugins={[remarkGfm]}>{idea.details}</Markdown>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
