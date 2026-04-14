import { describe, it, expect } from 'vitest'
import { SavingsProjectsFormSchema } from './form-validation'

describe('SavingsProjectsFormSchema', () => {
    const validData = {
        projects: [
            {
                title: 'Trip',
                objective: 3000,
                startingValue: 500,
                monthlyContributions: { '2026-01': 200 },
            },
        ],
    }

    it('passes for valid data', async () => {
        await expect(SavingsProjectsFormSchema.validate(validData)).resolves.toBeDefined()
    })

    it('passes for empty projects array', async () => {
        await expect(SavingsProjectsFormSchema.validate({ projects: [] })).resolves.toBeDefined()
    })

    it('fails when title is missing', async () => {
        const data = {
            projects: [{ ...validData.projects[0], title: '' }],
        }
        await expect(SavingsProjectsFormSchema.validate(data)).rejects.toThrow()
    })

    it('fails when objective is negative', async () => {
        const data = {
            projects: [{ ...validData.projects[0], objective: -100 }],
        }
        await expect(SavingsProjectsFormSchema.validate(data)).rejects.toThrow()
    })

    it('passes when startingValue is negative (withdrawals)', async () => {
        const data = {
            projects: [{ ...validData.projects[0], startingValue: -50 }],
        }
        await expect(SavingsProjectsFormSchema.validate(data)).resolves.toBeDefined()
    })

    it('passes with zero objective and startingValue', async () => {
        const data = {
            projects: [{ ...validData.projects[0], objective: 0, startingValue: 0 }],
        }
        await expect(SavingsProjectsFormSchema.validate(data)).resolves.toBeDefined()
    })
})
