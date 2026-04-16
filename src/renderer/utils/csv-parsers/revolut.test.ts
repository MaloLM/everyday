import { describe, it, expect } from 'vitest'
import { parseRevolutCsv } from './revolut'

const HEADER = 'Type,Product,Started Date,Completed Date,Description,Amount,Fee,Currency,State,Balance'

describe('parseRevolutCsv', () => {
    it('parses valid rows with TERMINÉ state', () => {
        const csv = [
            HEADER,
            'CARD_PAYMENT,Current,2026-01-01,2026-01-01,Supermarket,-25.50,-0.50,EUR,TERMINÉ,1000',
            'TRANSFER,Current,2026-01-02,2026-01-02,Rent,-800.00,0.00,EUR,TERMINÉ,200',
        ].join('\n')

        const rows = parseRevolutCsv(csv)
        expect(rows).toHaveLength(2)
        expect(rows[0]).toEqual({
            type: 'CARD_PAYMENT',
            description: 'Supermarket',
            amount: -25.50,
            fee: -0.50,
            currency: 'EUR',
        })
        expect(rows[1].description).toBe('Rent')
    })

    it('filters out non-TERMINÉ rows', () => {
        const csv = [
            HEADER,
            'CARD_PAYMENT,Current,2026-01-01,2026-01-01,Shop,-10,0,EUR,TERMINÉ,500',
            'CARD_PAYMENT,Current,2026-01-01,2026-01-01,Pending,-5,0,EUR,EN ATTENTE,500',
            'CARD_PAYMENT,Current,2026-01-01,2026-01-01,Declined,-3,0,EUR,REFUSÉ,500',
        ].join('\n')

        const rows = parseRevolutCsv(csv)
        expect(rows).toHaveLength(1)
        expect(rows[0].description).toBe('Shop')
    })

    it('handles quoted fields with commas', () => {
        const csv = [
            HEADER,
            '"CARD_PAYMENT",Current,2026-01-01,2026-01-01,"Restaurant, Bar",-42.00,0,EUR,TERMINÉ,500',
        ].join('\n')

        const rows = parseRevolutCsv(csv)
        expect(rows).toHaveLength(1)
        expect(rows[0].description).toBe('Restaurant, Bar')
    })

    it('handles escaped double quotes in fields', () => {
        const csv = [
            HEADER,
            'CARD_PAYMENT,Current,2026-01-01,2026-01-01,"Shop ""Best""",  -10,0,EUR,TERMINÉ,500',
        ].join('\n')

        const rows = parseRevolutCsv(csv)
        expect(rows).toHaveLength(1)
        expect(rows[0].description).toBe('Shop "Best"')
    })

    it('returns empty array for header-only CSV', () => {
        const rows = parseRevolutCsv(HEADER)
        expect(rows).toHaveLength(0)
    })

    it('returns empty array for empty input', () => {
        const rows = parseRevolutCsv('')
        expect(rows).toHaveLength(0)
    })

    it('skips rows with too few columns', () => {
        const csv = [
            HEADER,
            'CARD_PAYMENT,Current,2026-01-01',
            'TRANSFER,Current,2026-01-02,2026-01-02,Valid,-100,0,EUR,TERMINÉ,500',
        ].join('\n')

        const rows = parseRevolutCsv(csv)
        expect(rows).toHaveLength(1)
        expect(rows[0].description).toBe('Valid')
    })

    it('handles Windows-style line endings', () => {
        const csv = [
            HEADER,
            'TRANSFER,Current,2026-01-01,2026-01-01,Rent,-800,0,EUR,TERMINÉ,200',
        ].join('\r\n')

        const rows = parseRevolutCsv(csv)
        expect(rows).toHaveLength(1)
    })

    it('parses amount and fee as numbers', () => {
        const csv = [
            HEADER,
            'CARD_PAYMENT,Current,2026-01-01,2026-01-01,Test,-12.34,-0.56,EUR,TERMINÉ,500',
        ].join('\n')

        const rows = parseRevolutCsv(csv)
        expect(rows[0].amount).toBe(-12.34)
        expect(rows[0].fee).toBe(-0.56)
    })

    it('defaults to 0 for non-numeric amount/fee', () => {
        const csv = [
            HEADER,
            'CARD_PAYMENT,Current,2026-01-01,2026-01-01,Test,abc,xyz,EUR,TERMINÉ,500',
        ].join('\n')

        const rows = parseRevolutCsv(csv)
        expect(rows[0].amount).toBe(0)
        expect(rows[0].fee).toBe(0)
    })
})
