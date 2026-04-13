import toast from 'react-hot-toast'

export async function copyMarkdownToClipboard(markdown: string, label = 'Copied to clipboard') {
    try {
        await navigator.clipboard.writeText(markdown)
        toast.success(label)
    } catch {
        toast.error('Failed to copy to clipboard')
    }
}
