import { Form, Formik } from 'formik'
import { useEffect, useRef, useState } from 'react'
import { TamFormResponse, TamFormSchema, ChartData, TamFormData, parseToChartData } from '../../../utils'
import { Button, Card } from '../..'
import { ClipboardCopy, Eye, EyeOff, Save } from 'lucide-react'
import { TamDonutChart } from './TamDonutChart'
import { TamBarChart } from './TamBarChart'
import { buildTargetAllocationMarkdown } from './tamMarkdown'
import { copyMarkdownToClipboard } from '../../../utils/clipboard'
import toast from 'react-hot-toast'
import { useAppContext } from '../../../context'
import { ErrorMessages } from '../../utils/ErrorMessage'
import { AssetList } from './AssetList'
import { BudgetCurrencyForm } from './BudgetCurrencyForm'

interface TamFormProps {
    tamData: TamFormData
    onSubmit: (values: any) => void
    computeResult: TamFormResponse
    saveConfig: (values: any) => void
}

export const TamForm = ({ tamData, onSubmit, computeResult, saveConfig }: TamFormProps) => {
    const { blurFinances, toggleBlurFinances } = useAppContext()
    const formRef = useRef<HTMLDivElement>(null)
    const [chartData, setChartData] = useState<ChartData>({} as ChartData)
    useEffect(() => {
        if (computeResult && computeResult.assets && computeResult.assets.length > 0) {
            setChartData(parseToChartData(computeResult))
        }
    }, [computeResult])

    const handleUpdate = (setFieldValue, values) => {
        updateChart()
        values.assets.forEach((asset, index) => {
            setFieldValue(`assets[${index}].quantityOwned`, asset.newQuantity)
        })
        toast.success('Configuration updated!')
    }

    const updateChart = () => {
        const newData: ChartData = { ...chartData }
        newData.datasets = newData.datasets.map((dataset) => {
            if (dataset.label === 'Current Volume') {
                let targetData = chartData.datasets.find((d) => d.label === 'Next Buy')?.data || []
                let currentData = dataset.data.map((d, i) => d + targetData[i])
                return {
                    ...dataset,
                    data: currentData,
                }
            } else if (dataset.label === 'Next Buy') {
                return {
                    ...dataset,
                    data: dataset.data.map((d) => 0),
                }
            }
            return dataset
        })
        setChartData(newData)
    }

    return (
        <Formik
            initialValues={{
                assets: tamData.assets,
                budget: tamData.budget,
                currency: tamData.currency,
            }}
            validationSchema={TamFormSchema}
            onSubmit={(values) => {
                onSubmit({
                    assets: values.assets,
                    currency: values.currency,
                    budget: values.budget,
                })
            }}
        >
            {({ values, errors, dirty, handleSubmit, setFieldValue, isValid, resetForm }) => {
                return (
                    <Form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex items-center gap-3">
                            <h1 className="font-serif text-4xl font-medium tracking-wider">Target Allocation Maintenance</h1>
                            <Button onClick={() => { saveConfig(values); resetForm({ values }) }} filled={!dirty} title="Save configuration" className="flex items-center gap-2 px-4">
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
                            className=" relative "
                            title="Current Allocation"
                            titleButton={
                                <button
                                    type="button"
                                    title="Copy as markdown"
                                    onClick={() =>
                                        copyMarkdownToClipboard(
                                            buildTargetAllocationMarkdown({
                                                assets: values.assets,
                                                currency: values.currency,
                                                budget: Number(values.budget) || 0,
                                            }),
                                            'Current allocation copied to clipboard'
                                        )
                                    }
                                    className="flex items-center gap-1 rounded-lg border border-softWhite/20 px-3 py-1.5 text-sm text-softWhite/70 transition-colors hover:border-nobleGold/30 hover:text-nobleGold"
                                >
                                    <ClipboardCopy size={14} /> Copy
                                </button>
                            }
                        >
                            <div
                                ref={formRef}
                                className={`flex flex-col-reverse gap-3 md:flex-row ${errors.assets ? 'pb-20 ' : ''}  min-h-110 md:pb-0`}
                            >
                                <AssetList values={values} errors={errors} setFieldValue={setFieldValue} />
                                <div className="flex w-full items-start justify-center">
                                    <TamDonutChart assets={values.assets} />
                                </div>
                                {errors.assets && (
                                    <div className="absolute bottom-3 left-0 right-0 flex justify-center md:bottom-24 md:left-1/2 md:mr-8 ">
                                        <ErrorMessages errorMessages={processErrors(errors.assets)} />
                                    </div>
                                )}
                            </div>
                        </Card>
                        <Card title="Next Buy Estimation">
                            <BudgetCurrencyForm
                                computeResult={computeResult}
                                handleUpdate={() => handleUpdate(setFieldValue, computeResult)}
                            />
                            <TamBarChart
                                chartData={chartData}
                                computeResult={computeResult}
                                onCompute={() => {
                                    if (!isValid) scrollTo(formRef)
                                }}
                                errors={errors}
                            />
                        </Card>
                    </Form>
                )
            }}
        </Formik>
    )
}

const scrollTo = (formRef) => {
    if (!formRef.current) return
    formRef.current.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
    })
}

const processErrors = (assetErrors) => {
    if (typeof assetErrors === 'string') return [assetErrors]

    const errorMessagesSet = new Set<string>()
    assetErrors.forEach((asset) => {
        asset &&
            Object.values(asset).forEach((errorMessage) => {
                if (errorMessage && typeof errorMessage == 'string') errorMessagesSet.add(errorMessage)
            })
    })

    return Array.from(errorMessagesSet)
}
