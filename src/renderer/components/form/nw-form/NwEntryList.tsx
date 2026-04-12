import { NetWorthEntry, CURRENCIES, computeNetWorth } from '../../../utils'
import { Button } from '../../Button'
import { Plus, Trash2 } from 'lucide-react'

interface NwEntryListProps {
    entries: NetWorthEntry[]
    currency: string
    selectedEntryId: string | null
    onSelectEntry: (entry: NetWorthEntry) => void
    onNewEntry: () => void
    onDeleteEntry: (entryId: string) => void
}

export const NwEntryList = ({
    entries,
    currency,
    selectedEntryId,
    onSelectEntry,
    onNewEntry,
    onDeleteEntry,
}: NwEntryListProps) => {
    const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date))
    const currencySymbol = CURRENCIES.get(currency) || currency

    return (
        <div className="flex w-full flex-col gap-2">
            <Button filled className="flex w-fit items-center rounded-full pr-4" onClick={onNewEntry}>
                <Plus size={20} />
                New Audit
            </Button>
            <div className="flex max-h-72 flex-col gap-1 overflow-y-auto pr-2">
                {sorted.length === 0 && (
                    <div className="flex h-20 items-center justify-center">
                        <p className="text-softWhite opacity-50">No audit entries yet</p>
                    </div>
                )}
                {sorted.map((entry) => {
                    const total = computeNetWorth(entry)
                    const isSelected = entry.id === selectedEntryId
                    return (
                        <div
                            key={entry.id}
                            onClick={() => onSelectEntry(entry)}
                            className={`bg-secondaryLightNobleBlack flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2
                                ${
                                    isSelected
                                        ? 'border-nobleGold bg-nobleBlack'
                                        : 'border-nobleBlack border-opacity-100 hover:border-opacity-40'
                                }`}
                        >
                            <div className="flex flex-col">
                                <span className="text-sm text-softWhite">{entry.date}</span>
                                <span className={`text-lg font-medium ${total >= 0 ? 'text-nobleGold' : 'text-error'}`}>
                                    {total.toLocaleString()} {currencySymbol}
                                </span>
                                <span className="text-xs text-softWhite opacity-50">
                                    {entry.items.length} item{entry.items.length !== 1 ? 's' : ''}
                                </span>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onDeleteEntry(entry.id)
                                }}
                                className="p-1 opacity-30 transition-opacity hover:text-error hover:opacity-100"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
