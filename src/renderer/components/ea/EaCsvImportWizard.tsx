import { useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, Upload, X } from 'lucide-react'
import { EaImport, EaTransaction } from '../../utils/types'
import { CSV_PARSERS, RawParsedRow } from '../../utils/csv-parsers'
import { Button, Card } from '..'

interface EaCsvImportWizardProps {
    onComplete: (importId: string) => void
    onCancel: () => void
    onSave: (importData: EaImport) => Promise<void>
}

type Step = 'upload' | 'filter' | 'confirm'

export const EaCsvImportWizard = ({ onComplete, onCancel, onSave }: EaCsvImportWizardProps) => {
    const [step, setStep] = useState<Step>('upload')
    const [bankSource, setBankSource] = useState('revolut')
    const [parsedRows, setParsedRows] = useState<RawParsedRow[]>([])
    const [selectedTypes, setSelectedTypes] = useState<Set<string>>(new Set())
    const [title, setTitle] = useState('')
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const bankOptions = [...CSV_PARSERS.keys()]

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setError(null)

        try {
            const text = await file.text()
            const parser = CSV_PARSERS.get(bankSource)
            if (!parser) {
                setError(`No parser available for "${bankSource}"`)
                return
            }
            const rows = parser(text)
            if (rows.length === 0) {
                setError('No valid rows found in the CSV file')
                return
            }
            setParsedRows(rows)
            const uniqueTypes = new Set(rows.map((r) => r.type))
            setSelectedTypes(uniqueTypes)
            setTitle(`Import ${new Date().toISOString().slice(0, 10)}`)
            setStep('filter')
        } catch {
            setError('Failed to parse the CSV file')
        }
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const toggleType = (type: string) => {
        setSelectedTypes((prev) => {
            const next = new Set(prev)
            if (next.has(type)) {
                next.delete(type)
            } else {
                next.add(type)
            }
            return next
        })
    }

    const filteredRows = parsedRows.filter((r) => selectedTypes.has(r.type))

    const handleConfirm = async () => {
        const importId = crypto.randomUUID()
        const transactions: EaTransaction[] = filteredRows.map((r) => ({
            id: crypto.randomUUID(),
            type: r.type,
            description: r.description,
            amount: r.amount,
            fee: r.fee,
            currency: r.currency,
            tag: '',
            flagged: false,
        }))

        const importData: EaImport = {
            id: importId,
            title,
            date: new Date().toISOString(),
            bankSource,
            transactions,
        }

        await onSave(importData)
        onComplete(importId)
    }

    const uniqueTypes = [...new Set(parsedRows.map((r) => r.type))]

    return (
        <Card title="New Import">
            <div className="flex flex-col gap-4">
                {/* Step indicator */}
                <div className="flex items-center gap-2 text-xs text-softWhite/50">
                    <span className={step === 'upload' ? 'text-nobleGold' : ''}>1. Upload</span>
                    <span>→</span>
                    <span className={step === 'filter' ? 'text-nobleGold' : ''}>2. Filter</span>
                    <span>→</span>
                    <span className={step === 'confirm' ? 'text-nobleGold' : ''}>3. Confirm</span>
                </div>

                {/* Step 1: Upload */}
                {step === 'upload' && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <label className="text-sm text-softWhite/60">Bank</label>
                            <select
                                value={bankSource}
                                onChange={(e) => setBankSource(e.target.value)}
                                className="field rounded bg-transparent px-2 py-1 text-sm text-softWhite"
                            >
                                {bankOptions.map((bank) => (
                                    <option key={bank} value={bank} className="bg-lightNobleBlack">
                                        {bank.charAt(0).toUpperCase() + bank.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 rounded-lg border border-nobleGold/40 px-4 py-2 text-sm text-nobleGold transition-colors hover:border-nobleGold hover:bg-nobleGold/10"
                            >
                                <Upload size={16} />
                                Upload CSV
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                className="hidden"
                                onChange={handleFileUpload}
                                data-testid="csv-file-input"
                            />
                        </div>
                        {error && <p className="text-sm text-error">{error}</p>}
                        <button
                            type="button"
                            onClick={onCancel}
                            className="self-start text-sm text-softWhite/50 hover:text-softWhite"
                        >
                            Cancel
                        </button>
                    </div>
                )}

                {/* Step 2: Filter by Type */}
                {step === 'filter' && (
                    <div className="flex flex-col gap-4">
                        <p className="text-sm text-softWhite/60">
                            {parsedRows.length} rows parsed. Select which types to import:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {uniqueTypes.map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => toggleType(type)}
                                    className={`rounded-full px-3 py-1 text-sm transition-colors ${
                                        selectedTypes.has(type)
                                            ? 'bg-nobleGold text-nobleBlack'
                                            : 'border border-nobleGold/40 text-nobleGold/70 hover:border-nobleGold hover:text-nobleGold'
                                    }`}
                                >
                                    {type} ({parsedRows.filter((r) => r.type === type).length})
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-softWhite/50">{filteredRows.length} rows selected</p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setStep('upload')}
                                className="flex items-center gap-1 text-sm text-softWhite/50 hover:text-softWhite"
                            >
                                <ArrowLeft size={14} /> Back
                            </button>
                            <Button
                                type="button"
                                onClick={() => setStep('confirm')}
                                filled={filteredRows.length > 0}
                                className="flex items-center gap-2 px-4"
                                disabled={filteredRows.length === 0}
                            >
                                <ArrowRight size={16} />
                                Next
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Confirm */}
                {step === 'confirm' && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <label className="text-sm text-softWhite/60">Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="field flex-1 bg-transparent px-2 py-1 text-sm text-softWhite"
                                maxLength={100}
                            />
                        </div>
                        <div className="max-h-60 overflow-y-auto rounded border border-white/5">
                            <table className="w-full text-left text-xs">
                                <thead>
                                    <tr className="border-b border-white/10 text-softWhite/50">
                                        <th className="px-2 py-1">Description</th>
                                        <th className="px-2 py-1">Type</th>
                                        <th className="px-2 py-1 text-right">Amount</th>
                                        <th className="px-2 py-1 text-right">Fee</th>
                                        <th className="px-2 py-1">Currency</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRows.map((r, i) => (
                                        <tr key={i} className="border-b border-white/5 text-softWhite/70">
                                            <td className="px-2 py-1">{r.description}</td>
                                            <td className="px-2 py-1">{r.type}</td>
                                            <td className="px-2 py-1 text-right">{r.amount.toFixed(2)}</td>
                                            <td className="px-2 py-1 text-right">{r.fee !== 0 ? r.fee.toFixed(2) : '—'}</td>
                                            <td className="px-2 py-1">{r.currency}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-sm text-softWhite/50">
                            {filteredRows.length} transactions — Total: {Math.abs(filteredRows.reduce((s, r) => s + r.amount, 0)).toFixed(2)}
                        </p>
                        <div className="flex gap-3">
                            <button
                                type="button"
                                onClick={() => setStep('filter')}
                                className="flex items-center gap-1 text-sm text-softWhite/50 hover:text-softWhite"
                            >
                                <ArrowLeft size={14} /> Back
                            </button>
                            <Button
                                type="button"
                                onClick={handleConfirm}
                                filled
                                className="flex items-center gap-2 px-4"
                                disabled={!title.trim()}
                            >
                                <Check size={16} />
                                Import
                            </Button>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="flex items-center gap-1 text-sm text-softWhite/50 hover:text-softWhite"
                            >
                                <X size={14} /> Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Card>
    )
}
