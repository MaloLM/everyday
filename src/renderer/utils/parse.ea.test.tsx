import { describe, it, expect } from 'vitest'
import { parseEaData } from './parse'
import { INIT_EA_DATA } from './constants'

describe('parseEaData', () => {
    it('parses a valid object', () => {
        const input = {
            imports: [{
                id: '1',
                title: 'Test Import',
                date: '2026-01-01',
                bankSource: 'revolut',
                transactions: [
                    { id: 't1', type: 'CARD_PAYMENT', description: 'Shop', amount: -25, fee: 0, currency: 'EUR', tag: '', flagged: false },
                ],
            }],
        }
        const result = parseEaData(input)
        expect(result.imports).toHaveLength(1)
        expect(result.imports[0].title).toBe('Test Import')
        expect(result.imports[0].transactions).toHaveLength(1)
    })

    it('parses a JSON string', () => {
        const input = JSON.stringify({
            imports: [{
                title: 'String Import',
                date: '2026-02-01',
                bankSource: 'revolut',
                transactions: [],
            }],
        })
        const result = parseEaData(input)
        expect(result.imports[0].title).toBe('String Import')
        expect(result.imports[0].id).toBeTruthy()
    })

    it('returns INIT_EA_DATA for empty object', () => {
        const result = parseEaData({})
        expect(result).toEqual(INIT_EA_DATA)
    })

    it('returns INIT_EA_DATA for invalid JSON', () => {
        const result = parseEaData('not json')
        expect(result).toEqual(INIT_EA_DATA)
    })

    it('returns INIT_EA_DATA for object without imports', () => {
        const result = parseEaData({ someOtherField: true })
        expect(result).toEqual(INIT_EA_DATA)
    })

    it('assigns UUIDs to imports without id', () => {
        const input = {
            imports: [{
                title: 'No ID',
                date: '2026-01-01',
                bankSource: 'revolut',
                transactions: [],
            }],
        }
        const result = parseEaData(input)
        expect(result.imports[0].id).toBeTruthy()
    })

    it('assigns UUIDs to transactions without id', () => {
        const input = {
            imports: [{
                id: 'imp-1',
                title: 'Test',
                date: '2026-01-01',
                bankSource: 'revolut',
                transactions: [
                    { type: 'CARD_PAYMENT', description: 'Shop', amount: -10, fee: 0, currency: 'EUR', tag: '', flagged: false },
                ],
            }],
        }
        const result = parseEaData(input)
        expect(result.imports[0].transactions[0].id).toBeTruthy()
    })

    it('preserves existing ids', () => {
        const input = {
            imports: [{
                id: 'existing-import-id',
                title: 'Test',
                date: '2026-01-01',
                bankSource: 'revolut',
                transactions: [
                    { id: 'existing-tx-id', type: 'CARD_PAYMENT', description: 'Shop', amount: -10, fee: 0, currency: 'EUR', tag: '', flagged: false },
                ],
            }],
        }
        const result = parseEaData(input)
        expect(result.imports[0].id).toBe('existing-import-id')
        expect(result.imports[0].transactions[0].id).toBe('existing-tx-id')
    })
})
