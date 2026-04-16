import { RawParsedRow } from './types'

/**
 * Parse a single CSV line respecting RFC 4180 quoted fields.
 * Handles commas inside double-quoted values.
 */
function parseCsvLine(line: string): string[] {
    const fields: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
        const char = line[i]
        if (inQuotes) {
            if (char === '"') {
                if (i + 1 < line.length && line[i + 1] === '"') {
                    current += '"'
                    i++
                } else {
                    inQuotes = false
                }
            } else {
                current += char
            }
        } else {
            if (char === '"') {
                inQuotes = true
            } else if (char === ',') {
                fields.push(current.trim())
                current = ''
            } else {
                current += char
            }
        }
    }
    fields.push(current.trim())
    return fields
}

/**
 * Revolut CSV parser.
 *
 * Expected columns:
 *   0: Type, 1: Product, 2: Start Date, 3: End Date, 4: Description,
 *   5: Amount, 6: Fee, 7: Currency, 8: State, 9: Balance
 *
 * Only rows where State === "TERMINÉ" are kept.
 */
export function parseRevolutCsv(csvText: string): RawParsedRow[] {
    const lines = csvText.split(/\r?\n/).filter((l) => l.trim().length > 0)
    if (lines.length <= 1) return []

    const rows: RawParsedRow[] = []

    for (let i = 1; i < lines.length; i++) {
        const fields = parseCsvLine(lines[i])
        if (fields.length < 9) continue

        const state = fields[8]
        if (state !== 'TERMINÉ') continue

        rows.push({
            type: fields[0],
            description: fields[4],
            amount: parseFloat(fields[5]) || 0,
            fee: parseFloat(fields[6]) || 0,
            currency: fields[7],
        })
    }

    return rows
}
