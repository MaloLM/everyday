import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface RecipeMarkdownRendererProps {
    content: string
}

export const RecipeMarkdownRenderer = ({ content }: RecipeMarkdownRendererProps) => {
    if (!content.trim()) {
        return <p className="text-sm italic text-softWhite/40">No instructions yet.</p>
    }

    return (
        <div className="prose-recipe">
            <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
        </div>
    )
}
