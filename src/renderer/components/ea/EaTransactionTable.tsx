import { Flag } from 'lucide-react'
import { EaTransaction } from '../../utils/types'
import { CURRENCIES } from '../../utils/constants'
import { EaTagInput } from './EaTagInput'

interface EaTransactionTableProps {
    transactions: EaTransaction[]
    allTags: string[]
    onUpdateTransaction: (index: number, field: keyof EaTransaction, value: string | number | boolean) => void
    onToggleFlag: (index: number) => void
}

export const EaTransactionTable = ({ transactions, allTags, onUpdateTransaction, onToggleFlag }: EaTransactionTableProps) => {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
                <thead>
                    <tr className="border-b border-white/10 text-xs text-softWhite/50">
                        <th className="px-3 py-2 font-medium">Description</th>
                        <th className="px-3 py-2 font-medium">Type</th>
                        <th className="px-3 py-2 font-medium text-right">Amount</th>
                        <th className="px-3 py-2 font-medium">Currency</th>
                        <th className="px-3 py-2 font-medium">Tag</th>
                        <th className="px-3 py-2 font-medium w-10"></th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((t, i) => (
                        <tr
                            key={t.id}
                            className={`border-b border-white/5 transition-colors ${t.flagged ? 'bg-error/10' : 'hover:bg-white/[0.02]'}`}
                        >
                            <td className="px-3 py-2">
                                <input
                                    type="text"
                                    value={t.description}
                                    onChange={(e) => onUpdateTransaction(i, 'description', e.target.value)}
                                    className="field w-full bg-transparent px-1 py-0.5 text-sm text-softWhite/80"
                                    maxLength={200}
                                />
                            </td>
                            <td className="px-3 py-2 text-softWhite/60">{t.type}</td>
                            <td className="fin-value px-3 py-2 text-right text-softWhite/80">
                                {t.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                            <td className="px-3 py-2 text-softWhite/60">{CURRENCIES.get(t.currency) || t.currency}</td>
                            <td className="px-3 py-2">
                                <EaTagInput
                                    value={t.tag}
                                    allTags={allTags}
                                    onChange={(v) => onUpdateTransaction(i, 'tag', v)}
                                />
                            </td>
                            <td className="px-3 py-2">
                                <button
                                    type="button"
                                    onClick={() => onToggleFlag(i)}
                                    title={t.flagged ? 'Remove flag' : 'Flag this expense'}
                                    className={`transition-colors ${t.flagged ? 'text-error' : 'text-softWhite/30 hover:text-error/70'}`}
                                >
                                    <Flag size={14} fill={t.flagged ? 'currentColor' : 'none'} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {transactions.length === 0 && (
                <p className="py-6 text-center text-sm text-softWhite/40">No transactions</p>
            )}
        </div>
    )
}
