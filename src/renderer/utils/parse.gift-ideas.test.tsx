import { describe, it, expect } from 'vitest'
import { parseGiftIdeasData } from './parse'
import { INIT_GIFT_IDEAS_DATA } from './constants'

describe('parseGiftIdeasData', () => {
    it('returns init data for empty object', () => {
        expect(parseGiftIdeasData({})).toEqual(INIT_GIFT_IDEAS_DATA)
    })

    it('returns init data for empty string', () => {
        expect(parseGiftIdeasData('')).toEqual(INIT_GIFT_IDEAS_DATA)
    })

    it('returns init data for invalid JSON string', () => {
        expect(parseGiftIdeasData('not json')).toEqual(INIT_GIFT_IDEAS_DATA)
    })

    it('returns init data when ideas key is missing', () => {
        expect(parseGiftIdeasData({ other: [] })).toEqual(INIT_GIFT_IDEAS_DATA)
    })

    it('parses valid data', () => {
        const input = {
            ideas: [
                { id: 'g1', title: 'Book', details: 'A nice book', offered: false },
                { id: 'g2', title: 'Watch', details: '', offered: true },
            ],
        }
        const result = parseGiftIdeasData(input)
        expect(result.ideas).toHaveLength(2)
        expect(result.ideas[0].title).toBe('Book')
        expect(result.ideas[0].offered).toBe(false)
        expect(result.ideas[1].offered).toBe(true)
    })

    it('assigns UUIDs to ideas without ids', () => {
        const input = { ideas: [{ title: 'Gift', details: '', offered: false }] }
        const result = parseGiftIdeasData(input)
        expect(result.ideas[0].id).toBeDefined()
    })

    it('defaults offered to false when missing', () => {
        const input = { ideas: [{ id: 'g1', title: 'Gift', details: '' }] }
        const result = parseGiftIdeasData(input)
        expect(result.ideas[0].offered).toBe(false)
    })

    it('parses from JSON string', () => {
        const input = JSON.stringify({
            ideas: [{ id: 'g1', title: 'Perfume', details: '# Nice', offered: false }],
        })
        const result = parseGiftIdeasData(input)
        expect(result.ideas).toHaveLength(1)
        expect(result.ideas[0].title).toBe('Perfume')
    })
})
