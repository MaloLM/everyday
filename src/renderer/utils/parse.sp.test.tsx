import { describe, it, expect } from 'vitest'
import { parseSavingsProjectsData, computeProjectTotal, getMonthColumns } from './parse'
import { INIT_SP_DATA } from './constants'
import { SavingsProject } from './types'

describe('parseSavingsProjectsData', () => {
    it('returns INIT_SP_DATA for empty object', () => {
        expect(parseSavingsProjectsData({})).toEqual(INIT_SP_DATA)
    })

    it('returns INIT_SP_DATA for empty string', () => {
        expect(parseSavingsProjectsData('{}')).toEqual(INIT_SP_DATA)
    })

    it('returns INIT_SP_DATA for missing projects key', () => {
        expect(parseSavingsProjectsData({ currency: 'EUR' })).toEqual(INIT_SP_DATA)
    })

    it('returns INIT_SP_DATA for invalid JSON string', () => {
        expect(parseSavingsProjectsData('not json')).toEqual(INIT_SP_DATA)
    })

    it('parses valid data', () => {
        const input = {
            projects: [
                { id: 'p1', title: 'Trip', objective: 3000, startingValue: 500, monthlyContributions: { '2026-01': 200 } },
            ],
            currency: 'USD',
        }
        const result = parseSavingsProjectsData(input)
        expect(result.currency).toBe('USD')
        expect(result.projects).toHaveLength(1)
        expect(result.projects[0].title).toBe('Trip')
        expect(result.projects[0].monthlyContributions['2026-01']).toBe(200)
    })

    it('assigns UUID when id is missing', () => {
        const input = {
            projects: [{ title: 'Car', objective: 10000, startingValue: 0, monthlyContributions: {} }],
            currency: 'EUR',
        }
        const result = parseSavingsProjectsData(input)
        expect(result.projects[0].id).toContain('test-uuid')
    })

    it('defaults monthlyContributions to empty object when missing', () => {
        const input = {
            projects: [{ id: 'p1', title: 'Test', objective: 100, startingValue: 0 }],
            currency: 'EUR',
        }
        const result = parseSavingsProjectsData(input)
        expect(result.projects[0].monthlyContributions).toEqual({})
    })
})

describe('computeProjectTotal', () => {
    it('returns startingValue when no contributions', () => {
        const project: SavingsProject = {
            id: '1', title: 'A', objective: 1000, startingValue: 500,
            monthlyContributions: {},
        }
        expect(computeProjectTotal(project)).toBe(500)
    })

    it('sums startingValue and all contributions', () => {
        const project: SavingsProject = {
            id: '1', title: 'A', objective: 1000, startingValue: 100,
            monthlyContributions: { '2026-01': 200, '2026-02': 150, '2026-03': 50 },
        }
        expect(computeProjectTotal(project)).toBe(500)
    })

    it('handles string values gracefully', () => {
        const project = {
            id: '1', title: 'A', objective: 1000, startingValue: '100',
            monthlyContributions: { '2026-01': '200' },
        } as unknown as SavingsProject
        expect(computeProjectTotal(project)).toBe(300)
    })
})

describe('getMonthColumns', () => {
    it('returns months from earliest contribution to now + extra', () => {
        const projects: SavingsProject[] = [
            { id: '1', title: 'A', objective: 100, startingValue: 0, monthlyContributions: { '2026-01': 10, '2026-03': 20 } },
        ]
        const months = getMonthColumns(projects, 0)
        expect(months[0]).toBe('2026-01')
        // Should include at least up to the current month
        expect(months.length).toBeGreaterThanOrEqual(3)
    })

    it('returns current month + extra when no contributions exist', () => {
        const months = getMonthColumns([], 2)
        expect(months.length).toBeGreaterThanOrEqual(3)
        // First month should be current month
        const now = new Date()
        const expected = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
        expect(months[0]).toBe(expected)
    })

    it('returns sorted months', () => {
        const projects: SavingsProject[] = [
            { id: '1', title: 'A', objective: 100, startingValue: 0, monthlyContributions: { '2025-12': 10 } },
            { id: '2', title: 'B', objective: 100, startingValue: 0, monthlyContributions: { '2025-06': 5 } },
        ]
        const months = getMonthColumns(projects, 0)
        expect(months[0]).toBe('2025-06')
        for (let i = 1; i < months.length; i++) {
            expect(months[i].localeCompare(months[i - 1])).toBeGreaterThan(0)
        }
    })

    it('ignores invalid month keys', () => {
        const projects: SavingsProject[] = [
            { id: '1', title: 'A', objective: 100, startingValue: 0, monthlyContributions: { 'bad-key': 10, '2026-02': 5 } },
        ]
        const months = getMonthColumns(projects, 0)
        expect(months).not.toContain('bad-key')
        expect(months).toContain('2026-02')
    })
})
