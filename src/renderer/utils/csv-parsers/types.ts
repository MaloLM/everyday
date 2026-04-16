export interface RawParsedRow {
    type: string
    description: string
    amount: number
    fee: number
    currency: string
}

export type CsvParser = (csvText: string) => RawParsedRow[]
