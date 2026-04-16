import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { EaImport } from '../../utils/types'
import { CURRENCIES } from '../../utils/constants'
import { Button } from '..'
import { EaCsvImportWizard } from './EaCsvImportWizard'

interface EaImportListProps {
    imports: EaImport[]
    onSaveImport: (importData: EaImport) => Promise<void>
    onRefresh: () => Promise<void>
}

export const EaImportList = ({ imports, onSaveImport, onRefresh }: EaImportListProps) => {
    const navigate = useNavigate()
    const [isImporting, setIsImporting] = useState(false)

    const sortedImports = [...imports].sort((a, b) => b.date.localeCompare(a.date))

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

            {sortedImports.length === 0 && !isImporting && (
                <p className="py-10 text-center text-softWhite/40">No imports yet. Click "New Import" to get started.</p>
            )}

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
        </div>
    )
}
