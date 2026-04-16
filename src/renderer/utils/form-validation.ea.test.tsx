import { describe, it, expect } from 'vitest'
import { EaImportSchema } from './form-validation'

describe('EaImportSchema', () => {
    const validData = {
        title: 'January Import',
        bankSource: 'revolut',
        transactions: [
            {
                description: 'Supermarket',
                type: 'CARD_PAYMENT',
                amount: -25.50,
                fee: 0,
                currency: 'EUR',
                tag: 'Food',
                flagged: false,
            },
        ],
    }

    it('passes for valid data', async () => {
        await expect(EaImportSchema.validate(validData)).resolves.toBeDefined()
    })

    it('passes for empty transactions array', async () => {
        await expect(EaImportSchema.validate({ ...validData, transactions: [] })).resolves.toBeDefined()
    })

    it('fails when title is missing', async () => {
        await expect(EaImportSchema.validate({ ...validData, title: '' })).rejects.toThrow()
    })

    it('fails when title exceeds max length', async () => {
        await expect(EaImportSchema.validate({ ...validData, title: 'a'.repeat(101) })).rejects.toThrow()
    })

    it('fails when bankSource is missing', async () => {
        await expect(EaImportSchema.validate({ ...validData, bankSource: '' })).rejects.toThrow()
    })

    it('fails when transaction description is missing', async () => {
        const data = {
            ...validData,
            transactions: [{ ...validData.transactions[0], description: '' }],
        }
        await expect(EaImportSchema.validate(data)).rejects.toThrow()
    })

    it('fails when transaction tag exceeds max length', async () => {
        const data = {
            ...validData,
            transactions: [{ ...validData.transactions[0], tag: 'a'.repeat(31) }],
        }
        await expect(EaImportSchema.validate(data)).rejects.toThrow()
    })

    it('passes with negative amounts', async () => {
        const data = {
            ...validData,
            transactions: [{ ...validData.transactions[0], amount: -100 }],
        }
        await expect(EaImportSchema.validate(data)).resolves.toBeDefined()
    })
})
