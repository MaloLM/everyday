import { describe, it, expect } from 'vitest'
import { parseBudgetData, computeNetIncome, computeTotalExpenses } from './parse'
import { INIT_BUDGET_DATA } from './constants'

describe('parseBudgetData', () => {
    it('parses a valid object', () => {
        const input = {
            expenses: [{ id: '1', label: 'Rent', value: 1200, details: '', tag: '' }],
            incomes: [{ id: '2', label: 'Salary', value: 3000, deductionRate: 0, tag: '' }],
            currency: 'EUR',
        }
        const result = parseBudgetData(input)
        expect(result.expenses[0].label).toBe('Rent')
        expect(result.incomes[0].label).toBe('Salary')
        expect(result.currency).toBe('EUR')
    })

    it('parses a JSON string', () => {
        const input = JSON.stringify({
            expenses: [],
            incomes: [{ label: 'Job', value: 2000, deductionRate: 10, tag: 'Work' }],
            currency: 'USD',
        })
        const result = parseBudgetData(input)
        expect(result.incomes[0].label).toBe('Job')
        expect(result.incomes[0].id).toBeTruthy()
    })

    it('returns INIT_BUDGET_DATA for empty object', () => {
        const result = parseBudgetData({})
        expect(result).toEqual(INIT_BUDGET_DATA)
    })

    it('returns INIT_BUDGET_DATA for invalid JSON', () => {
        const result = parseBudgetData('not json')
        expect(result).toEqual(INIT_BUDGET_DATA)
    })

    it('assigns UUIDs to items without id', () => {
        const input = {
            expenses: [{ label: 'Food', value: 300, details: '', tag: '' }],
            incomes: [],
            currency: 'EUR',
        }
        const result = parseBudgetData(input)
        expect(result.expenses[0].id).toBeTruthy()
    })

    it('preserves existing ids', () => {
        const input = {
            expenses: [{ id: 'existing-id', label: 'Food', value: 300, details: '', tag: '' }],
            incomes: [],
            currency: 'EUR',
        }
        const result = parseBudgetData(input)
        expect(result.expenses[0].id).toBe('existing-id')
    })
})

describe('computeNetIncome', () => {
    it('sums income after deductions', () => {
        const incomes = [
            { id: '1', label: 'Salary', value: 3000, deductionRate: 25, tag: '' },
            { id: '2', label: 'Freelance', value: 1000, deductionRate: 0, tag: '' },
        ]
        expect(computeNetIncome(incomes)).toBe(3250)
    })

    it('returns 0 for empty array', () => {
        expect(computeNetIncome([])).toBe(0)
    })

    it('handles 100% deduction rate', () => {
        const incomes = [
            { id: '1', label: 'Test', value: 1000, deductionRate: 100, tag: '' },
        ]
        expect(computeNetIncome(incomes)).toBe(0)
    })
})

describe('computeTotalExpenses', () => {
    it('sums expense values', () => {
        const expenses = [
            { id: '1', label: 'Rent', value: 1200, details: '', tag: '' },
            { id: '2', label: 'Food', value: 400, details: '', tag: '' },
        ]
        expect(computeTotalExpenses(expenses)).toBe(1600)
    })

    it('returns 0 for empty array', () => {
        expect(computeTotalExpenses([])).toBe(0)
    })
})
