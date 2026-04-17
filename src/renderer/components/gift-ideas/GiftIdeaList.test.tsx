import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GiftIdeaList } from './GiftIdeaList'
import { GiftIdea } from '../../utils/types'

const mockIdeas: GiftIdea[] = [
    { id: 'g1', title: 'A nice book', details: 'Something about **cooking**', offered: false },
    { id: 'g2', title: 'Watch', details: 'Swiss made', offered: true },
    { id: 'g3', title: 'Perfume', details: '', offered: false },
]

const defaultProps = {
    ideas: mockIdeas,
    onSave: vi.fn(),
    onDelete: vi.fn(),
    onToggleOffered: vi.fn(),
}

describe('GiftIdeaList', () => {
    it('renders all idea titles', () => {
        render(<GiftIdeaList {...defaultProps} />)
        expect(screen.getByText('A nice book')).toBeInTheDocument()
        expect(screen.getByText('Watch')).toBeInTheDocument()
        expect(screen.getByText('Perfume')).toBeInTheDocument()
    })

    it('renders the search input', () => {
        render(<GiftIdeaList {...defaultProps} />)
        expect(screen.getByPlaceholderText('Search gift ideas...')).toBeInTheDocument()
    })

    it('renders the New Idea button', () => {
        render(<GiftIdeaList {...defaultProps} />)
        expect(screen.getByText('New Idea')).toBeInTheDocument()
    })

    it('filters ideas by title', async () => {
        render(<GiftIdeaList {...defaultProps} />)
        await userEvent.type(screen.getByPlaceholderText('Search gift ideas...'), 'book')
        expect(screen.getByText('A nice book')).toBeInTheDocument()
        expect(screen.queryByText('Watch')).not.toBeInTheDocument()
        expect(screen.queryByText('Perfume')).not.toBeInTheDocument()
    })

    it('filters ideas by details content', async () => {
        render(<GiftIdeaList {...defaultProps} />)
        await userEvent.type(screen.getByPlaceholderText('Search gift ideas...'), 'Swiss')
        expect(screen.getByText('Watch')).toBeInTheDocument()
        expect(screen.queryByText('A nice book')).not.toBeInTheDocument()
    })

    it('shows no-match message when search finds nothing', async () => {
        render(<GiftIdeaList {...defaultProps} />)
        await userEvent.type(screen.getByPlaceholderText('Search gift ideas...'), 'xyz')
        expect(screen.getByText('No ideas match your search.')).toBeInTheDocument()
    })

    it('shows empty state message when no ideas exist', () => {
        render(<GiftIdeaList {...defaultProps} ideas={[]} />)
        expect(screen.getByText('No gift ideas yet. Add your first one!')).toBeInTheDocument()
    })

    it('expands details when title row is clicked', async () => {
        render(<GiftIdeaList {...defaultProps} />)
        await userEvent.click(screen.getByText('A nice book'))
        expect(screen.getByText('cooking')).toBeInTheDocument()
    })

    it('collapses details when title row is clicked again', async () => {
        render(<GiftIdeaList {...defaultProps} />)
        await userEvent.click(screen.getByText('A nice book'))
        expect(screen.getByText('cooking')).toBeInTheDocument()
        await userEvent.click(screen.getByText('A nice book'))
        expect(screen.queryByText('cooking')).not.toBeInTheDocument()
    })

    it('calls onToggleOffered when checkbox is clicked', async () => {
        const onToggleOffered = vi.fn()
        render(<GiftIdeaList {...defaultProps} onToggleOffered={onToggleOffered} />)
        const checkboxes = screen.getAllByTitle('Mark as offered')
        await userEvent.click(checkboxes[0])
        expect(onToggleOffered).toHaveBeenCalledWith(mockIdeas[0])
    })

    it('applies strikethrough style to offered ideas', () => {
        render(<GiftIdeaList {...defaultProps} />)
        const watchTitle = screen.getByText('Watch')
        expect(watchTitle.className).toContain('line-through')
    })

    it('shows add form when New Idea is clicked', async () => {
        render(<GiftIdeaList {...defaultProps} />)
        await userEvent.click(screen.getByText('New Idea'))
        expect(screen.getByPlaceholderText('Title')).toBeInTheDocument()
        expect(screen.getByPlaceholderText('Details (markdown supported)')).toBeInTheDocument()
    })

    it('calls onSave with new idea when Add is clicked', async () => {
        const onSave = vi.fn()
        render(<GiftIdeaList {...defaultProps} onSave={onSave} />)
        await userEvent.click(screen.getByText('New Idea'))
        await userEvent.type(screen.getByPlaceholderText('Title'), 'Flowers')
        await userEvent.type(screen.getByPlaceholderText('Details (markdown supported)'), 'Red roses')
        await userEvent.click(screen.getByText('Add'))
        expect(onSave).toHaveBeenCalledWith(
            expect.objectContaining({ title: 'Flowers', details: 'Red roses', offered: false })
        )
    })

    it('shows edit form when edit button is clicked', async () => {
        render(<GiftIdeaList {...defaultProps} />)
        const editButtons = screen.getAllByTitle('Edit')
        await userEvent.click(editButtons[0])
        expect(screen.getByDisplayValue('A nice book')).toBeInTheDocument()
    })

    it('calls onSave with edited idea when Save is clicked', async () => {
        const onSave = vi.fn()
        render(<GiftIdeaList {...defaultProps} onSave={onSave} />)
        const editButtons = screen.getAllByTitle('Edit')
        await userEvent.click(editButtons[0])
        const titleInput = screen.getByDisplayValue('A nice book')
        await userEvent.clear(titleInput)
        await userEvent.type(titleInput, 'Updated book')
        await userEvent.click(screen.getByText('Save'))
        expect(onSave).toHaveBeenCalledWith(
            expect.objectContaining({ id: 'g1', title: 'Updated book' })
        )
    })
})
