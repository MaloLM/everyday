import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, Save, Trash2 } from 'lucide-react'
import { EaImport, EaTransaction } from '../../utils/types'
import { CURRENCIES } from '../../utils/constants'
import { Card, Button, ConfirmModal } from '..'
import { EaExpenseChart } from './EaExpenseChart'
import { EaTransactionTable } from './EaTransactionTable'
import { useAppContext } from '../../context'
import toast from 'react-hot-toast'

interface EaImportDetailProps {
    importData: EaImport
    allKnownTags: string[]
    onSave: (updated: EaImport) => Promise<void>
    onDelete: (importId: string) => Promise<void>
}

export const EaImportDetail = ({ importData, allKnownTags, onSave, onDelete }: EaImportDetailProps) => {
    const navigate = useNavigate()
    const { blurFinances, toggleBlurFinances } = useAppContext()
    const [title, setTitle] = useState(importData.title)
    const [transactions, setTransactions] = useState<EaTransaction[]>(importData.transactions)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [dirty, setDirty] = useState(false)
    const [activeTag, setActiveTag] = useState<string | null>(null)

    const currencySymbol = transactions.length > 0
        ? CURRENCIES.get(transactions[0].currency) || transactions[0].currency
        : '€'

    const totalExpenses = transactions.reduce((sum, t) => sum + Math.abs(t.amount), 0)

    const allTags = [...new Set(transactions.map((t) => t.tag).filter(Boolean))]
    const filteredTransactions = activeTag
        ? transactions.filter((t) => t.tag === activeTag)
        : transactions

    const handleUpdateTransaction = (index: number, field: keyof EaTransaction, value: string | number | boolean) => {
        setTransactions((prev) => {
            const updated = [...prev]
            updated[index] = { ...updated[index], [field]: value }
            return updated
        })
        setDirty(true)
    }

    const handleToggleFlag = (index: number) => {
        setTransactions((prev) => {
            const updated = [...prev]
            updated[index] = { ...updated[index], flagged: !updated[index].flagged }
            return updated
        })
        setDirty(true)
    }

    const handleSave = async () => {
        try {
            await onSave({ ...importData, title, transactions })
            setDirty(false)
            toast.success('Import saved')
        } catch {
            toast.error('Failed to save import')
        }
    }

    const handleDelete = async () => {
        try {
            await onDelete(importData.id)
            toast.success('Import deleted')
            navigate('/ea')
        } catch {
            toast.error('Failed to delete import')
        }
    }

    return (
        <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => navigate('/ea')}
                    className="rounded-lg border border-softWhite/20 p-2 text-softWhite/70 transition-colors hover:border-nobleGold/30 hover:text-nobleGold"
                    title="Back to imports"
                >
                    <ArrowLeft size={18} />
                </button>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => { setTitle(e.target.value); setDirty(true) }}
                    className="field flex-1 bg-transparent font-serif text-4xl font-medium tracking-wider text-nobleGold"
                    maxLength={100}
                />
                <Button type="button" filled={!dirty} title="Save import" className="flex items-center gap-2 px-4" onClick={handleSave}>
                    <Save size={16} />
                    Save
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
                    onClick={() => setConfirmOpen(true)}
                    title="Delete import"
                    className="rounded-lg border border-error/30 p-2 text-error/70 transition-colors hover:border-error hover:text-error"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            <Card title="Summary">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:justify-evenly">
                    <div className="flex flex-col items-center gap-2">
                        <h3 className="text-sm font-medium text-softWhite/70">Total Expenses</h3>
                        <div className="flex items-baseline gap-2">
                            <span className="fin-value text-3xl font-medium text-nobleGold">
                                {totalExpenses.toLocaleString(undefined, totalExpenses % 1 !== 0
                                    ? { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                                    : { maximumFractionDigits: 0 })}
                            </span>
                            <span className="text-sm text-softWhite/50">{currencySymbol}</span>
                        </div>
                        <span className="text-xs text-softWhite/40">{transactions.length} transactions</span>
                    </div>
                    <EaExpenseChart transactions={transactions} currencySymbol={currencySymbol} />
                </div>
            </Card>

            <Card title="Transactions">
                <div className="flex flex-col gap-4">
                    {allTags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => setActiveTag(null)}
                                className={`rounded-full px-3 py-1 text-sm transition-colors ${
                                    activeTag === null
                                        ? 'bg-nobleGold text-nobleBlack'
                                        : 'border border-nobleGold/40 text-nobleGold/70 hover:border-nobleGold hover:text-nobleGold'
                                }`}
                            >
                                All
                            </button>
                            {allTags.map((tag) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => setActiveTag(tag === activeTag ? null : tag)}
                                    className={`rounded-full px-3 py-1 text-sm transition-colors ${
                                        activeTag === tag
                                            ? 'bg-nobleGold text-nobleBlack'
                                            : 'border border-nobleGold/40 text-nobleGold/70 hover:border-nobleGold hover:text-nobleGold'
                                    }`}
                                >
                                    {tag}
                                </button>
                            ))}
                        </div>
                    )}
                    <EaTransactionTable
                        transactions={filteredTransactions}
                        allTags={allKnownTags}
                        onUpdateTransaction={(index, field, value) => {
                            const realIndex = activeTag
                                ? transactions.findIndex((t) => t.id === filteredTransactions[index].id)
                                : index
                            handleUpdateTransaction(realIndex, field, value)
                        }}
                        onToggleFlag={(index) => {
                            const realIndex = activeTag
                                ? transactions.findIndex((t) => t.id === filteredTransactions[index].id)
                                : index
                            handleToggleFlag(realIndex)
                        }}
                    />
                </div>
            </Card>

            <ConfirmModal
                isOpen={confirmOpen}
                title="Delete Import"
                message={`Are you sure you want to delete "${importData.title}"? This action cannot be undone.`}
                confirmLabel="Delete"
                onConfirm={handleDelete}
                onCancel={() => setConfirmOpen(false)}
                danger
            />
        </div>
    )
}
