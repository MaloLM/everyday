import { useRef, useState } from 'react'
import { Form, Formik } from 'formik'
import { useSaveShortcut } from '../../../hooks/useSaveShortcut'
import { NetWorthData, NetWorthEntry, NwEntrySchema, CURRENCIES, computeNetWorth } from '../../../utils'
import { Button, Card } from '../..'
import { Eye, EyeOff, Save } from 'lucide-react'
import { NwItemList } from './NwItemList'
import { NwEntryList } from './NwEntryList'
import { NwLineChart } from './NwLineChart'
import { NwTreemap } from './NwTreemap'
import toast from 'react-hot-toast'
import { useAppContext } from '../../../context'
import { ErrorMessages } from '../../utils/ErrorMessage'

interface NwFormProps {
    nwData: NetWorthData
    onSaveEntry: (entry: NetWorthEntry) => Promise<void>
    onDeleteEntry: (entryId: string) => Promise<void>
}

const todayStr = () => new Date().toISOString().split('T')[0]

const cloneItemsWithNewIds = (items: NetWorthEntry['items']) =>
    items.map((item) => ({ ...item, id: crypto.randomUUID() }))

export const NwForm = ({ nwData, onSaveEntry, onDeleteEntry }: NwFormProps) => {
    const { blurFinances, toggleBlurFinances } = useAppContext()
    const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null)
    const [formKey, setFormKey] = useState(0)
    const submitRef = useRef<{ dirty: boolean; handleSubmit: () => void } | null>(null)
    useSaveShortcut(() => { if (submitRef.current?.dirty) submitRef.current.handleSubmit() })

    const selectedEntry = nwData.entries.find((e) => e.id === selectedEntryId) || null

    const getInitialValues = (): { date: string; items: NetWorthEntry['items'] } => {
        if (selectedEntry) {
            return { date: selectedEntry.date, items: selectedEntry.items }
        }
        const sorted = [...nwData.entries].sort((a, b) => b.date.localeCompare(a.date))
        const mostRecent = sorted[0]
        return {
            date: todayStr(),
            items: mostRecent ? cloneItemsWithNewIds(mostRecent.items) : [{ id: crypto.randomUUID(), name: 'Item Name', estimatedValue: 0 }],
        }
    }

    const handleNewEntry = () => {
        setSelectedEntryId(null)
        setFormKey((k) => k + 1)
    }

    const handleSelectEntry = (entry: NetWorthEntry) => {
        setSelectedEntryId(entry.id)
        setFormKey((k) => k + 1)
    }

    const handleDelete = async (entryId: string) => {
        await onDeleteEntry(entryId)
        if (selectedEntryId === entryId) {
            setSelectedEntryId(null)
            setFormKey((k) => k + 1)
        }
        toast.success('Entry deleted')
    }

    return (
        <Formik
            key={formKey}
            initialValues={getInitialValues()}
            validationSchema={NwEntrySchema}
            onSubmit={async (values) => {
                const entry: NetWorthEntry = {
                    id: selectedEntryId || crypto.randomUUID(),
                    date: values.date,
                    items: values.items.map((item) => ({
                        ...item,
                        estimatedValue: Number(item.estimatedValue),
                        estimatedYield: Number(item.estimatedYield) || 0,
                    })),
                }
                await onSaveEntry(entry)
                setSelectedEntryId(entry.id)
                toast.success('Entry saved')
            }}
        >
            {({ values, errors, dirty, handleSubmit, setFieldValue }) => {
                submitRef.current = { dirty, handleSubmit }

                const total = computeNetWorth({ id: '', date: '', items: values.items.map((i) => ({ ...i, estimatedValue: Number(i.estimatedValue) || 0 })) })
                const currencySymbol = CURRENCIES.get(nwData.currency) || nwData.currency
                return (
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                            <h1 className="font-serif text-4xl font-medium tracking-wider">Net Worth Assessment</h1>
                            <Button type="submit" filled={!dirty} title="Save entry" className="flex items-center gap-2 px-4" onClick={() => handleSubmit()}>
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
                        </div>
                        <Card title="Net Worth Evolution">
                            <NwLineChart entries={nwData.entries} currency={nwData.currency} />
                        </Card>

                        <Card title="Asset Allocation">
                            <NwTreemap
                                entry={{
                                    id: '',
                                    date: '',
                                    items: values.items.map((i) => ({
                                        ...i,
                                        estimatedValue: Number(i.estimatedValue) || 0,
                                        estimatedYield: Number(i.estimatedYield) || 0,
                                    })),
                                }}
                                currency={nwData.currency}
                            />
                        </Card>

                        <Card title="Audit Entry">
                            <div className="flex flex-col gap-5 lg:flex-row">
                                <div className="w-full lg:w-1/3">
                                    <NwEntryList
                                        entries={nwData.entries}
                                        currency={nwData.currency}
                                        selectedEntryId={selectedEntryId}
                                        onSelectEntry={handleSelectEntry}
                                        onNewEntry={handleNewEntry}
                                        onDeleteEntry={handleDelete}
                                    />
                                </div>

                                <div className="w-full lg:w-2/3">
                                    <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-sm font-medium ${selectedEntryId ? 'text-softWhite/60' : 'text-nobleGold'}`}>
                                                {selectedEntryId ? `Editing entry — ${values.date}` : 'New entry'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <label className="text-xs text-softWhite opacity-50">Date</label>
                                                <input
                                                    type="date"
                                                    value={values.date}
                                                    onChange={(e) => setFieldValue('date', e.target.value)}
                                                    className="field max-w-40 border-transparent bg-transparent text-softWhite"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-xs text-softWhite opacity-50">Net Worth</label>
                                                <span className={`fin-value text-xl font-medium ${total >= 0 ? 'text-nobleGold' : 'text-error'}`}>
                                                    {total.toLocaleString()} {currencySymbol}
                                                </span>
                                            </div>
                                        </div>

                                        <NwItemList
                                            values={{ items: values.items, currency: nwData.currency }}
                                            errors={errors}
                                            setFieldValue={setFieldValue}
                                        />

                                        {errors.items && typeof errors.items === 'string' && (
                                            <ErrorMessages errorMessages={[errors.items]} />
                                        )}
                                    </Form>
                                </div>
                            </div>
                        </Card>
                    </div>
                )
            }}
        </Formik>
    )
}
