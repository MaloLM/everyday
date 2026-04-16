import { useState, useMemo } from 'react'
import { Form, Formik, useFormikContext } from 'formik'
import { useSaveShortcut } from '../../../hooks/useSaveShortcut'
import {
    BudgetData,
    BudgetFormSchema, CURRENCIES, CURRENCY_OPTIONS,
    computeNetIncome, computeTotalExpenses,
} from '../../../utils'
import { Button, Card } from '../..'
import { ClipboardCopy, Eye, EyeOff, Save } from 'lucide-react'
import { SelectorField } from '../SelectorField'
import { BudgetExpenseList } from './BudgetExpenseList'
import { BudgetIncomeList } from './BudgetIncomeList'
import { BudgetCharts } from './BudgetCharts'
import { BudgetTagFilter } from './BudgetTagFilter'
import { buildBudgetIncomesMarkdown, buildBudgetExpensesMarkdown } from './budgetMarkdown'
import { copyMarkdownToClipboard } from '../../../utils/clipboard'
import toast from 'react-hot-toast'
import { useAppContext } from '../../../context'

interface BudgetFormProps {
    budgetData: BudgetData
    onSave: (data: BudgetData) => Promise<void>
}

const BudgetFormInner = ({ activeTag, setActiveTag }: { activeTag: string | null, setActiveTag: (tag: string | null) => void }) => {
    const { blurFinances, toggleBlurFinances } = useAppContext()
    const { values, errors, dirty, handleSubmit, setFieldValue } = useFormikContext<{ incomes: BudgetData['incomes'], expenses: BudgetData['expenses'], currency: string }>()

    useSaveShortcut(() => { if (dirty) handleSubmit() })

    const currencySymbol = CURRENCIES.get(values.currency) || values.currency

    const normalizedIncomes = useMemo(() => values.incomes.map((i) => ({
        ...i,
        value: Number(i.value) || 0,
        deductionRate: Number(i.deductionRate) || 0,
    })), [values.incomes])

    const normalizedExpenses = useMemo(() => values.expenses.map((e) => ({
        ...e,
        value: Number(e.value) || 0,
    })), [values.expenses])

    const allTags = useMemo(() => [
        ...new Set([
            ...values.incomes.map((i) => i.tag).filter(Boolean),
            ...values.expenses.map((e) => e.tag).filter(Boolean),
        ]),
    ], [values.incomes, values.expenses])

    const filteredIncomes = useMemo(() => activeTag
        ? normalizedIncomes.filter((i) => i.tag === activeTag)
        : normalizedIncomes, [activeTag, normalizedIncomes])

    const filteredExpenses = useMemo(() => activeTag
        ? normalizedExpenses.filter((e) => e.tag === activeTag)
        : normalizedExpenses, [activeTag, normalizedExpenses])

    const filteredNetIncome = useMemo(() => computeNetIncome(filteredIncomes), [filteredIncomes])
    const filteredTotalExpenses = useMemo(() => computeTotalExpenses(filteredExpenses), [filteredExpenses])

    return (
        <Form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
                <h1 className="font-serif text-4xl font-medium tracking-wider">Budgeting</h1>
                <Button type="submit" filled={!dirty} title="Save budget" className="flex items-center gap-2 px-4">
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
            <Card
                title="Monthly Summary"
                titleButton={
                    <div className="flex items-center gap-2">
                        <SelectorField
                            title="Currency"
                            name="currency"
                            options={CURRENCY_OPTIONS}
                            className="text-sm"
                        />
                    </div>
                }
            >
                <div className="flex flex-col gap-4">
                    <BudgetTagFilter tags={allTags} activeTag={activeTag} onTagClick={setActiveTag} />
                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-8">
                        <div className="flex items-baseline gap-2">
                            <span className="text-sm text-softWhite/60">Income (net)</span>
                            <span className="fin-value text-2xl font-medium text-nobleGold">
                                {filteredNetIncome.toLocaleString(undefined, filteredNetIncome % 1 !== 0
                                    ? { minimumFractionDigits: 1, maximumFractionDigits: 1 }
                                    : { maximumFractionDigits: 0 })}
                            </span>
                            <span className="text-sm text-softWhite/60">{currencySymbol}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-sm text-softWhite/60">Expenses</span>
                            <span className="fin-value text-2xl font-medium text-nobleGold">
                                {filteredTotalExpenses.toLocaleString(undefined, filteredTotalExpenses % 1 !== 0
                                    ? { minimumFractionDigits: 1, maximumFractionDigits: 1 }
                                    : { maximumFractionDigits: 0 })}
                            </span>
                            <span className="text-sm text-softWhite/60">{currencySymbol}</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-sm text-softWhite/60">Balance</span>
                            <span className={`fin-value text-2xl font-medium ${filteredNetIncome - filteredTotalExpenses >= 0 ? 'text-nobleGold' : 'text-error'}`}>
                                {(filteredNetIncome - filteredTotalExpenses).toLocaleString(undefined,
                                    Math.abs(filteredNetIncome - filteredTotalExpenses) % 1 !== 0
                                        ? { minimumFractionDigits: 1, maximumFractionDigits: 1 }
                                        : { maximumFractionDigits: 0 })}
                            </span>
                            <span className="text-sm text-softWhite/60">{currencySymbol}</span>
                        </div>
                    </div>
                    {activeTag && (
                        <span className="rounded-full bg-nobleGold/15 px-2 py-0.5 text-xs text-nobleGold w-fit">
                            filtered: {activeTag}
                        </span>
                    )}
                </div>
            </Card>

            <Card title="Charts">
                <BudgetCharts
                    incomes={normalizedIncomes}
                    expenses={normalizedExpenses}
                    currencySymbol={currencySymbol}
                />
            </Card>

            <div className="flex flex-col gap-5">
                <Card
                    title="Income"
                    titleButton={
                        <button
                            type="button"
                            title="Copy incomes as markdown"
                            onClick={() =>
                                copyMarkdownToClipboard(
                                    buildBudgetIncomesMarkdown(normalizedIncomes, values.currency),
                                    'Income copied to clipboard'
                                )
                            }
                            className="flex items-center gap-1 rounded-lg border border-softWhite/20 px-3 py-1.5 text-sm text-softWhite/70 transition-colors hover:border-nobleGold/30 hover:text-nobleGold"
                        >
                            <ClipboardCopy size={14} /> Copy
                        </button>
                    }
                >
                    <BudgetIncomeList
                        values={{ incomes: values.incomes, currency: values.currency }}
                        errors={errors}
                        setFieldValue={setFieldValue}
                    />
                </Card>

                <Card
                    title="Expenses"
                    titleButton={
                        <button
                            type="button"
                            title="Copy expenses as markdown"
                            onClick={() =>
                                copyMarkdownToClipboard(
                                    buildBudgetExpensesMarkdown(normalizedExpenses, values.currency),
                                    'Expenses copied to clipboard'
                                )
                            }
                            className="flex items-center gap-1 rounded-lg border border-softWhite/20 px-3 py-1.5 text-sm text-softWhite/70 transition-colors hover:border-nobleGold/30 hover:text-nobleGold"
                        >
                            <ClipboardCopy size={14} /> Copy
                        </button>
                    }
                >
                    <BudgetExpenseList
                        values={{ expenses: values.expenses, currency: values.currency }}
                        errors={errors}
                        setFieldValue={setFieldValue}
                    />
                </Card>
            </div>
        </Form>
    )
}

export const BudgetForm = ({ budgetData, onSave }: BudgetFormProps) => {
    const [activeTag, setActiveTag] = useState<string | null>(null)
    const [formKey, setFormKey] = useState(0)

    return (
        <Formik
            key={formKey}
            initialValues={{
                expenses: budgetData.expenses,
                incomes: budgetData.incomes,
                currency: budgetData.currency,
            }}
            validationSchema={BudgetFormSchema}
            enableReinitialize={false}
            onSubmit={async (values) => {
                try {
                    const normalized: BudgetData = {
                        expenses: values.expenses.map((e) => ({
                            ...e,
                            value: Number(e.value) || 0,
                        })),
                        incomes: values.incomes.map((i) => ({
                            ...i,
                            value: Number(i.value) || 0,
                            deductionRate: Number(i.deductionRate) || 0,
                        })),
                        currency: values.currency,
                    }
                    await onSave(normalized)
                    setFormKey((k) => k + 1)
                    toast.success('Budget saved')
                } catch {
                    toast.error('Failed to save budget')
                }
            }}
        >
            <BudgetFormInner activeTag={activeTag} setActiveTag={setActiveTag} />
        </Formik>
    )
}
