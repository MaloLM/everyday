import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Download, Eye, EyeOff, GripVertical, Plus, Upload, X } from 'lucide-react'
import { EaImport } from '../../utils/types'
import { CURRENCIES } from '../../utils/constants'
import { Button, Card } from '..'
import { EaCsvImportWizard } from './EaCsvImportWizard'
import { EaExpenseChart } from './EaExpenseChart'
import { EaEvolutionChart } from './EaEvolutionChart'
import { useAppContext } from '../../context'
import { useDragReorder } from '../../hooks/useDragReorder'
import toast from 'react-hot-toast'

interface EaImportListProps {
    imports: EaImport[]
    allKnownTags: string[]
    onSaveImport: (importData: EaImport) => Promise<void>
    onSaveTags: (tags: string[]) => Promise<void>
    onReorder: (fromIndex: number, toIndex: number) => void
    onRefresh: () => Promise<void>
}

export const EaImportList = ({ imports, allKnownTags, onSaveImport, onSaveTags, onReorder, onRefresh }: EaImportListProps) => {
    const navigate = useNavigate()
    const { blurFinances, toggleBlurFinances } = useAppContext()
    const [isImporting, setIsImporting] = useState(false)
    const [newTag, setNewTag] = useState('')
    const fileInputRef = useRef<HTMLInputElement>(null)
    const { dragIndex, overIndex, dragHandlers } = useDragReorder(onReorder)

    const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        try {
            const text = await file.text()
            const data = JSON.parse(text)
            if (!data.title || !Array.isArray(data.transactions)) {
                toast.error('Invalid import file format')
                return
            }
            const imported: EaImport = {
                ...data,
                id: crypto.randomUUID(),
            }
            await onSaveImport(imported)
            await onRefresh()
            toast.success('Import loaded successfully')
        } catch {
            toast.error('Failed to load import file')
        }
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleExport = (imp: EaImport, e: React.MouseEvent) => {
        e.stopPropagation()
        const blob = new Blob([JSON.stringify(imp, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const slug = imp.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        a.download = `ea-${slug}-${imp.date.slice(0, 10)}.json`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
    }

    // Array order is the explicit display order (top = most recent, bottom = oldest)
    const sortedImports = imports

    const allTransactions = imports.flatMap((imp) => imp.transactions)
    const globalCurrency = allTransactions.length > 0
        ? CURRENCIES.get(allTransactions[0].currency) || allTransactions[0].currency
        : '€'

    const handleComplete = async (importId: string) => {
        await onRefresh()
        setIsImporting(false)
        navigate(`/ea/${importId}`)
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
                <h1 className="font-serif text-4xl font-medium tracking-wider">Expense Analysis</h1>
                <Button
                    type="button"
                    onClick={() => setIsImporting(true)}
                    filled
                    className="flex items-center gap-2 px-4"
                >
                    <Plus size={16} />
                    New Import
                </Button>
                <button
                    type="button"
                    onClick={toggleBlurFinances}
                    title={blurFinances ? 'Show amounts' : 'Hide amounts'}
                    className={`rounded-lg border p-2 transition-colors ${blurFinances
                        ? 'border-nobleGold/30 bg-nobleGold/10 text-nobleGold'
                        : 'border-softWhite/20 text-softWhite/50 hover:text-softWhite'
                    }`}
                >
                    {blurFinances ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Import from file"
                    className="rounded-lg border border-nobleGold/40 p-2 text-nobleGold transition-colors hover:border-nobleGold hover:bg-nobleGold/10"
                >
                    <Upload size={18} />
                </button>
                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={handleFileImport}
                    data-testid="import-file-input"
                />
            </div>

            {isImporting && (
                <EaCsvImportWizard
                    onComplete={handleComplete}
                    onCancel={() => setIsImporting(false)}
                    onSave={onSaveImport}
                />
            )}

            <Card title="Categories">
                <div className="flex flex-col gap-3">
                    <div className="flex flex-wrap gap-2">
                        {allKnownTags.map((tag) => (
                            <span
                                key={tag}
                                className="flex items-center gap-1.5 rounded-full border border-nobleGold/40 px-3 py-1 text-sm text-nobleGold/80"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => onSaveTags(allKnownTags.filter((t) => t !== tag))}
                                    className="text-softWhite/30 transition-colors hover:text-error"
                                    title={`Remove "${tag}"`}
                                >
                                    <X size={12} />
                                </button>
                            </span>
                        ))}
                        {allKnownTags.length === 0 && (
                            <span className="text-sm text-softWhite/40">No categories yet</span>
                        )}
                    </div>
                    <form
                        className="flex items-center gap-2"
                        onSubmit={(e) => {
                            e.preventDefault()
                            const trimmed = newTag.trim()
                            if (trimmed && !allKnownTags.includes(trimmed)) {
                                onSaveTags([...allKnownTags, trimmed])
                                setNewTag('')
                            }
                        }}
                    >
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="New category..."
                            className="field bg-transparent px-2 py-1 text-sm text-softWhite"
                            maxLength={30}
                        />
                        <Button type="submit" filled className="flex items-center gap-1 px-3 py-1 text-sm" disabled={!newTag.trim()}>
                            <Plus size={14} />
                            Add
                        </Button>
                    </form>
                </div>
            </Card>

            {sortedImports.length === 0 && !isImporting && (
                <p className="py-10 text-center text-softWhite/40">No imports yet. Click "New Import" to get started.</p>
            )}

            {sortedImports.length > 0 && (
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                    <div className="flex min-w-0 basis-1/2 flex-col gap-4">
                        {sortedImports.map((imp, index) => {
                            const total = imp.transactions.reduce((s, t) => s + Math.abs(t.amount), 0)
                            const currency = imp.transactions.length > 0
                                ? CURRENCIES.get(imp.transactions[0].currency) || imp.transactions[0].currency
                                : '€'
                            return (
                                <div
                                    key={imp.id}
                                    {...dragHandlers(index)}
                                    className={`flex items-center gap-2 transition-opacity ${
                                        dragIndex === index ? 'opacity-30' : ''
                                    } ${overIndex === index && dragIndex !== index ? 'border-t-2 border-nobleGold' : ''}`}
                                >
                                <div className="shrink-0 cursor-grab text-softWhite/30 hover:text-softWhite/60 active:cursor-grabbing">
                                    <GripVertical size={16} />
                                </div>
                                <button
                                    onClick={() => navigate(`/ea/${imp.id}`)}
                                    className="group relative flex flex-1 flex-col items-start rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition-all duration-300 hover:border-nobleGold/30 hover:bg-nobleGold/[0.06]"
                                >
                                    <div
                                        className="absolute right-4 top-4 opacity-0 transition-opacity group-hover:opacity-100"
                                        onClick={(e) => handleExport(imp, e)}
                                        title="Export import"
                                        role="button"
                                    >
                                        <Download size={16} className="text-softWhite/40 hover:text-nobleGold" />
                                    </div>
                                    <h2 className="mb-1 text-lg font-medium text-softWhite">{imp.title}</h2>
                                    <p className="mb-2 text-xs text-softWhite/40">
                                        {new Date(imp.date).toLocaleDateString()} — {imp.bankSource}
                                    </p>
                                    <div className="flex items-baseline gap-2">
                                        <span className="fin-value text-xl font-medium text-nobleGold">
                                            {total.toLocaleString(undefined, total % 1 !== 0
                                                ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                                                : { maximumFractionDigits: 0 })}
                                        </span>
                                        <span className="text-sm text-softWhite/50">{currency}</span>
                                    </div>
                                    <p className="mt-1 text-xs text-softWhite/40">{imp.transactions.length} transactions</p>
                                </button>
                                </div>
                            )
                        })}
                    </div>

                    {allTransactions.length > 0 && (
                        <div className="flex basis-1/2 flex-col gap-4 lg:sticky lg:top-4">
                            <Card title="Overall Expenses">
                                <EaExpenseChart transactions={allTransactions} currencySymbol={globalCurrency} />
                            </Card>
                            {sortedImports.length >= 2 && (
                                <Card title="Spending Evolution">
                                    <EaEvolutionChart imports={sortedImports} currencySymbol={globalCurrency} />
                                </Card>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
