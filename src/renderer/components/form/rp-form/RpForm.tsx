import { useState } from 'react'
import { Form, Formik } from 'formik'
import {
    RecurringPurchasesData, RecurringPurchaseItem,
    RpFormSchema, CURRENCIES, computeAnnualCost, computeTotalAnnualCost,
} from '../../../utils'
import { Button, Card } from '../..'
import { Save } from 'lucide-react'
import { RpItemList } from './RpItemList'
import { RpTagFilter } from './RpTagFilter'
import toast from 'react-hot-toast'

interface RpFormProps {
    rpData: RecurringPurchasesData
    onSave: (items: RecurringPurchaseItem[]) => Promise<void>
}

export const RpForm = ({ rpData, onSave }: RpFormProps) => {
    const [activeTag, setActiveTag] = useState<string | null>(null)
    const [formKey, setFormKey] = useState(0)

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
                        <Card title="Annual Summary">
                            <div className="flex flex-col gap-4">
                                <RpTagFilter tags={mergedTags} activeTag={activeTag} onTagClick={setActiveTag} />
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-medium text-nobleGold">
                                        {totalAnnual.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </span>
                                    <span className="text-lg text-softWhite/60">{currencySymbol} / year</span>
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
