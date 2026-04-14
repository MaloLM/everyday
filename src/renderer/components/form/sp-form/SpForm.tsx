import { useState } from 'react'
import { Form, Formik } from 'formik'
import {
    SavingsProjectsData,
    SavingsProjectsFormSchema,
    CURRENCIES,
    computeProjectTotal,
    getMonthColumns,
} from '../../../utils'
import { Button, Card } from '../..'
import { ClipboardCopy, Eye, EyeOff, Save } from 'lucide-react'
import { SelectorField } from '../SelectorField'
import { SpTable } from './SpTable'
import { buildSavingsProjectsMarkdown } from './spMarkdown'
import { copyMarkdownToClipboard } from '../../../utils/clipboard'
import toast from 'react-hot-toast'
import { useAppContext } from '../../../context'

interface SpFormProps {
    spData: SavingsProjectsData
    onSave: (data: SavingsProjectsData) => Promise<void>
}

export const SpForm = ({ spData, onSave }: SpFormProps) => {
    const { blurFinances, toggleBlurFinances } = useAppContext()
    const [formKey, setFormKey] = useState(0)

    return (
        <Formik
            key={formKey}
            initialValues={{
                projects: spData.projects,
                currency: spData.currency,
            }}
            validationSchema={SavingsProjectsFormSchema}
            enableReinitialize={false}
            onSubmit={async (values) => {
                try {
                    const normalized: SavingsProjectsData = {
                        projects: values.projects.map((p) => ({
                            ...p,
                            objective: Number(p.objective) || 0,
                            startingValue: Number(p.startingValue) || 0,
                            monthlyContributions: Object.fromEntries(
                                Object.entries(p.monthlyContributions)
                                    .map(([k, v]) => [k, Number(v) || 0] as const)
                                    .filter(([, v]) => v !== 0)
                            ),
                        })),
                        currency: values.currency,
                    }
                    await onSave(normalized)
                    setFormKey((k) => k + 1)
                    toast.success('Savings projects saved')
                } catch {
                    toast.error('Failed to save savings projects')
                }
            }}
        >
            {({ values, dirty, handleSubmit, setFieldValue }) => {
                const currencySymbol = CURRENCIES.get(values.currency) || values.currency

                const normalizedProjects = values.projects.map((p) => ({
                    ...p,
                    objective: Number(p.objective) || 0,
                    startingValue: Number(p.startingValue) || 0,
                    monthlyContributions: Object.fromEntries(
                        Object.entries(p.monthlyContributions).map(([k, v]) => [k, Number(v) || 0])
                    ),
                }))

                const totalSaved = normalizedProjects.reduce((sum, p) => sum + computeProjectTotal(p), 0)
                const totalObjective = normalizedProjects.reduce((sum, p) => sum + p.objective, 0)
                const globalProgress = totalObjective > 0 ? (totalSaved / totalObjective) * 100 : 0
                const globalBarWidth = Math.min(100, globalProgress)
                const globalExceeded = globalProgress > 100
                const months = getMonthColumns(normalizedProjects)

                const handleAdd = () => {
                    const newProject = {
                        id: crypto.randomUUID(),
                        title: '',
                        objective: 0,
                        startingValue: 0,
                        monthlyContributions: {} as Record<string, number>,
                    }
                    setFieldValue('projects', [...values.projects, newProject])
                }

                const handleDelete = (index: number) => {
                    const updated = values.projects.filter((_, i) => i !== index)
                    setFieldValue('projects', updated)
                }

                return (
                    <Form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                            <h1 className="font-serif text-4xl font-medium tracking-wider">Savings Projects</h1>
                            <Button type="submit" filled={!dirty} title="Save savings projects" className="flex items-center gap-2 px-4">
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
                                title="Copy as markdown"
                                onClick={() =>
                                    copyMarkdownToClipboard(
                                        buildSavingsProjectsMarkdown({ projects: normalizedProjects, currency: values.currency }),
                                        'Savings projects copied to clipboard'
                                    )
                                }
                                className="flex items-center gap-1 rounded-lg border border-softWhite/20 px-3 py-1.5 text-sm text-softWhite/70 transition-colors hover:border-nobleGold/30 hover:text-nobleGold"
                            >
                                <ClipboardCopy size={14} /> Copy
                            </button>
                        </div>

                        <Card
                            title="Overview"
                            titleButton={
                                <SelectorField
                                    title="Currency"
                                    name="currency"
                                    options={Array.from(CURRENCIES.keys())}
                                    className="text-sm"
                                />
                            }
                        >
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-col gap-2 sm:flex-row sm:gap-8">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-sm text-softWhite/60">Total saved</span>
                                        <span className={`fin-value text-2xl font-medium ${globalExceeded ? 'text-succesGreen' : 'text-nobleGold'}`}>
                                            {totalSaved.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </span>
                                        <span className="text-sm text-softWhite/60">{currencySymbol}</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-sm text-softWhite/60">Total objective</span>
                                        <span className="fin-value text-2xl font-medium text-softWhite/80">
                                            {totalObjective.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                        </span>
                                        <span className="text-sm text-softWhite/60">{currencySymbol}</span>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-sm text-softWhite/60">Progress</span>
                                        <span className={`text-2xl font-medium ${globalExceeded ? 'text-succesGreen' : 'text-nobleGold'}`}>
                                            {globalProgress.toFixed(0)}%
                                        </span>
                                    </div>
                                </div>
                                <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">
                                    <div
                                        className={`h-full rounded-full transition-all ${globalExceeded ? 'bg-succesGreen' : 'bg-nobleGold'}`}
                                        style={{ width: `${globalBarWidth}%` }}
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card title="Projects">
                            <SpTable
                                projects={normalizedProjects}
                                months={months}
                                currency={values.currency}
                                onAdd={handleAdd}
                                onDelete={handleDelete}
                            />
                        </Card>
                    </Form>
                )
            }}
        </Formik>
    )
}
