import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, X } from 'lucide-react'
import { EaImport } from '../../utils/types'
import { CURRENCIES } from '../../utils/constants'
import { Button, Card } from '..'
import { EaCsvImportWizard } from './EaCsvImportWizard'
import { EaExpenseChart } from './EaExpenseChart'

interface EaImportListProps {
    imports: EaImport[]
    allKnownTags: string[]
    onSaveImport: (importData: EaImport) => Promise<void>
    onSaveTags: (tags: string[]) => Promise<void>
    onRefresh: () => Promise<void>
}

export const EaImportList = ({ imports, allKnownTags, onSaveImport, onSaveTags, onRefresh }: EaImportListProps) => {
    const navigate = useNavigate()
    const [isImporting, setIsImporting] = useState(false)
    const [newTag, setNewTag] = useState('')

    const sortedImports = [...imports].sort((a, b) => b.date.localeCompare(a.date))

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
                    <div className="flex min-w-0 flex-1 flex-col gap-4">
                        {sortedImports.map((imp) => {
                            const total = imp.transactions.reduce((s, t) => s + Math.abs(t.amount), 0)
                            const currency = imp.transactions.length > 0
                                ? CURRENCIES.get(imp.transactions[0].currency) || imp.transactions[0].currency
                                : '€'
                            return (
                                <button
                                    key={imp.id}
                                    onClick={() => navigate(`/ea/${imp.id}`)}
                                    className="group flex flex-col items-start rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition-all duration-300 hover:border-nobleGold/30 hover:bg-nobleGold/[0.06]"
                                >
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
                            )
                        })}
                    </div>

                    {allTransactions.length > 0 && (
                        <div className="lg:sticky lg:top-4 lg:w-80 lg:shrink-0">
                            <Card title="Overall Expenses">
                                <EaExpenseChart transactions={allTransactions} currencySymbol={globalCurrency} />
                            </Card>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
