import { CsvParser } from './types'
import { parseRevolutCsv } from './revolut'

export const CSV_PARSERS: Map<string, CsvParser> = new Map([
    ['revolut', parseRevolutCsv],
])

export type { RawParsedRow, CsvParser } from './types'
