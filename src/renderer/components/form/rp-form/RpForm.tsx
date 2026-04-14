import { useState } from 'react'
import { Form, Formik } from 'formik'
import {
    RecurringPurchasesData, RecurringPurchaseItem,
    RpFormSchema, CURRENCIES, computeTotalAnnualCost,
    convertAnnualToUnit, RECURRENCE_UNITS, DISPLAY_UNIT_LABELS,
} from '../../../utils'
import type { DisplayUnit } from '../../../utils/constants'
import { Button, Card } from '../..'
import { ClipboardCopy, Save } from 'lucide-react'
import { RpItemList } from './RpItemList'
import { RpTagFilter } from './RpTagFilter'
import { buildRecurringPurchasesMarkdown } from './rpMarkdown'
import { copyMarkdownToClipboard } from '../../../utils/clipboard'
import toast from 'react-hot-toast'

interface RpFormProps {
    rpData: RecurringPurchasesData
    onSave: (items: RecurringPurchaseItem[]) => Promise<void>
}

export const RpForm = ({ rpData, onSave }: RpFormProps) => {
    const [activeTag, setActiveTag] = useState<string | null>(null)
    const [formKey, setFormKey] = useState(0)
    const [displayUnit, setDisplayUnit] = useState<DisplayUnit>('year')

    const cycleDisplayUnit = () => {
        const idx = RECURRENCE_UNITS.indexOf(displayUnit)
        setDisplayUnit(RECURRENCE_UNITS[(idx + 1) % RECURRENCE_UNITS.length])
    }

    const allTags = [...new Set(rpData.items.map((i) => i.tag).filter(Boolean))]
    const currencySymbol = CURRENCIES.get(rpData.currency) || rpData.currency

    return (
        <Formik
            key={formKey}
            initialValues={{ items: rpData.items }}
            validationSchema={RpFormSchema}
            enableReinitialize={false}
            onSubmit={async (values) => {
                try {
                    const normalized = values.items.map((item) => ({
                        ...item,
                        unitPrice: Number(item.unitPrice) || 0,
                        quantity: Number(item.quantity) || 0,
                        recurrence: {
                            every: Number(item.recurrence.every) || 1,
                            unit: item.recurrence.unit,
                        },
                    }))
                    await onSave(normalized)
                    setFormKey((k) => k + 1)
                    toast.success('Purchases saved')
                } catch {
                    toast.error('Failed to save purchases')
                }
            }}
        >
            {({ values, errors, dirty, handleSubmit, setFieldValue }) => {
                const displayItems = activeTag
                    ? values.items.filter((i) => i.tag === activeTag)
                    : values.items

                const totalAnnual = computeTotalAnnualCost(
                    displayItems.map((i) => ({
                        ...i,
                        unitPrice: Number(i.unitPrice) || 0,
                        quantity: Number(i.quantity) || 0,
                        recurrence: { every: Number(i.recurrence?.every) || 1, unit: i.recurrence?.unit || 'month' },
                    }))
                )

                const formTags = [...new Set(values.items.map((i) => i.tag).filter(Boolean))]
                const mergedTags = [...new Set([...allTags, ...formTags])]

                return (
                    <Form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <Card
                            title={displayUnit === 'year' ? 'Annual Summary' : `Summary ${DISPLAY_UNIT_LABELS[displayUnit]}`}
                            titleButton={
                                <button
                                    type="button"
                                    title="Copy as markdown"
                                    onClick={() =>
                                        copyMarkdownToClipboard(
                                            buildRecurringPurchasesMarkdown({
                                                items: values.items.map((i) => ({
                                                    ...i,
                                                    unitPrice: Number(i.unitPrice) || 0,
                                                    quantity: Number(i.quantity) || 0,
                                                    recurrence: {
                                                        every: Number(i.recurrence?.every) || 1,
                                                        unit: i.recurrence?.unit || 'month',
                                                    },
                                                })),
                                                currency: rpData.currency,
                                            }, displayUnit),
                                            'Recurring purchases copied to clipboard'
                                        )
                                    }
                                    className="flex items-center gap-1 rounded-lg border border-softWhite/20 px-3 py-1.5 text-sm text-softWhite/70 transition-colors hover:border-nobleGold/30 hover:text-nobleGold"
                                >
                                    <ClipboardCopy size={14} /> Copy
                                </button>
                            }
                        >
                            <div className="flex flex-col gap-4">
                                <RpTagFilter tags={mergedTags} activeTag={activeTag} onTagClick={setActiveTag} />
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-medium text-nobleGold">
                                        {(() => {
                                            const val = convertAnnualToUnit(totalAnnual, displayUnit)
                                            return val.toLocaleString(undefined, val % 1 !== 0
                                                ? { minimumFractionDigits: 1, maximumFractionDigits: 1 }
                                                : { maximumFractionDigits: 0 }
                                            )
                                        })()}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={cycleDisplayUnit}
                                        title="Cycle display unit"
                                        className="text-lg text-softWhite/60 transition-colors hover:text-nobleGold cursor-pointer"
                                    >
                                        {currencySymbol} {DISPLAY_UNIT_LABELS[displayUnit]}
                                    </button>
                                    {activeTag && (
                                        <span className="ml-2 rounded-full bg-nobleGold/15 px-2 py-0.5 text-xs text-nobleGold">
                                            filtered: {activeTag}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Card>

                        <Card title="Purchases">
                            <RpItemList
                                values={{ items: values.items, currency: rpData.currency }}
                                errors={errors}
                                setFieldValue={setFieldValue}
                                displayUnit={displayUnit}
                            />

                            <div className="flex gap-2 pt-2">
                                <Button type="submit" filled={!dirty} className="flex items-center gap-2 px-4">
                                    <Save size={16} />
                                    Save
                                </Button>
                            </div>
                        </Card>
                    </Form>
                )
            }}
        </Formik>
    )
}
