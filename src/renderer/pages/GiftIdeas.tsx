import { useState, useEffect } from 'react'
import { ClipboardCopy } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import { ipc } from '../api/electron'
import { GiftIdea } from '../utils/types'
import { copyMarkdownToClipboard } from '../utils/clipboard'
import { Loading } from '../components/utils/Loading'
import { GiftIdeaList } from '../components/gift-ideas/GiftIdeaList'
import { buildGiftIdeasMarkdown } from '../components/gift-ideas/giftIdeasMarkdown'
import toast from 'react-hot-toast'

export const GiftIdeas = () => {
    const { giftIdeasData, refreshGiftIdeasData } = useAppContext()
    const { saveGiftIdea, deleteGiftIdea } = ipc
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        refreshGiftIdeasData().finally(() => setIsLoading(false))
    }, [])

    const handleSave = async (idea: GiftIdea) => {
        await saveGiftIdea(idea)
        await refreshGiftIdeasData()
    }

    const handleDelete = async (ideaId: string) => {
        await deleteGiftIdea(ideaId)
        await refreshGiftIdeasData()
        toast.success('Gift idea deleted')
    }

    const handleToggleOffered = async (idea: GiftIdea) => {
        await saveGiftIdea({ ...idea, offered: !idea.offered })
        await refreshGiftIdeasData()
    }

    if (isLoading) return <Loading />

    return (
        <div className="flex h-full flex-col">
            <div className="mb-5 flex items-center justify-between">
                <h1 className="font-serif text-4xl font-medium tracking-wider">Gift Ideas</h1>
                <button
                    type="button"
                    title="Copy as markdown"
                    onClick={() =>
                        copyMarkdownToClipboard(
                            buildGiftIdeasMarkdown(giftIdeasData),
                            'Gift ideas copied to clipboard'
                        )
                    }
                    className="flex items-center gap-1 rounded-lg border border-softWhite/20 px-3 py-1.5 text-sm text-softWhite/70 transition-colors hover:border-nobleGold/30 hover:text-nobleGold"
                >
                    <ClipboardCopy size={14} /> Copy
                </button>
            </div>
            <GiftIdeaList
                ideas={giftIdeasData.ideas}
                onSave={handleSave}
                onDelete={handleDelete}
                onToggleOffered={handleToggleOffered}
            />
        </div>
    )
}
