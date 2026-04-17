import { GiftIdeasData } from '../../utils/types'

export function buildGiftIdeasMarkdown(data: GiftIdeasData): string {
    const { ideas } = data
    if (ideas.length === 0) return '# Gift Ideas\n\nNo ideas yet.\n'

    const lines: string[] = ['# Gift Ideas', '']
    const pending = ideas.filter((i) => !i.offered)
    const offered = ideas.filter((i) => i.offered)

    if (pending.length > 0) {
        lines.push('## Ideas', '')
        for (const idea of pending) {
            lines.push(`- **${idea.title}**${idea.details ? ` — ${idea.details}` : ''}`)
        }
        lines.push('')
    }

    if (offered.length > 0) {
        lines.push('## Offered', '')
        for (const idea of offered) {
            lines.push(`- ~~${idea.title}~~${idea.details ? ` — ${idea.details}` : ''}`)
        }
        lines.push('')
    }

    return lines.join('\n')
}
