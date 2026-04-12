import { useState } from 'react'
import { Form, Formik } from 'formik'
import { NetWorthData, NetWorthEntry, NwEntrySchema, CURRENCIES, computeNetWorth } from '../../../utils'
import { Button, Card } from '../..'
import { Save, X as XIcon } from 'lucide-react'
import { SelectorField } from '..'
import { NwItemList } from './NwItemList'
import { NwEntryList } from './NwEntryList'
import { NwLineChart } from './NwLineChart'
import toast from 'react-hot-toast'
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
    const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null)
    const [formKey, setFormKey] = useState(0)

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
        <div className="flex flex-col gap-5">
            <Card title="Net Worth Evolution">
                <NwLineChart entries={nwData.entries} currency={nwData.currency} />
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
                                    })),
                                }
                                await onSaveEntry(entry)
                                setSelectedEntryId(entry.id)
                                toast.success(selectedEntryId ? 'Entry updated' : 'Entry created')
                            }}
                        >
                            {({ values, errors, dirty, handleSubmit, setFieldValue }) => {
                                const total = computeNetWorth({ id: '', date: '', items: values.items.map((i) => ({ ...i, estimatedValue: Number(i.estimatedValue) || 0 })) })
                                const currencySymbol = CURRENCIES.get(nwData.currency) || nwData.currency
                                return (
                                    <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                                                <span className={`text-xl font-medium ${total >= 0 ? 'text-nobleGold' : 'text-error'}`}>
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

                                        <div className="flex gap-2">
                                            <Button type="submit" filled={!dirty} className="flex items-center gap-2 px-4">
                                                <Save size={16} />
                                                {selectedEntryId ? 'Update' : 'Save'}
                                            </Button>
                                            {selectedEntryId && (
                                                <Button onClick={handleNewEntry} className="flex items-center gap-1 px-4">
                                                    <XIcon size={16} />
                                                    Cancel
                                                </Button>
                                            )}
                                        </div>
                                    </Form>
                                )
                            }}
                        </Formik>
                    </div>
                </div>
            </Card>
        </div>
    )
}
