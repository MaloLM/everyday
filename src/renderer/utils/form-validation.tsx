import * as Yup from 'yup'

const AssetSchema = Yup.object().shape({
    assetName: Yup.string().required('Asset name is required'),
    unitPrice: Yup.number().min(1, 'Unit price must be positive').required('Unit price is required'),
    quantityOwned: Yup.number().min(0, 'Quantity must be non-negative').required('Quantity is required'),
    targetPercent: Yup.number()
        .min(0, 'Target % must be positive')
        .max(100, 'Target % must be between 0 and 100')
        .required('Target % is required'),
})

export const TamFormSchema = Yup.object().shape({
    assets: Yup.array()
        .of(AssetSchema)
        .test('total-target-percent', 'Total target % must equal 100', (assets) => {
            const total = assets?.reduce((acc, asset) => acc + asset.targetPercent, 0)
            return total === 100
        }),
    budget: Yup.number().min(0, 'Budget must be positive').required('Budget is required'),
    currency: Yup.string().required('Currency is required'),
})

const NwItemSchema = Yup.object().shape({
    name: Yup.string().required('Item name is required').max(50, 'Item name must be 50 characters or less'),
    estimatedValue: Yup.number().required('Estimated value is required').typeError('Estimated value must be a number'),
    estimatedYield: Yup.number().nullable().typeError('Yield must be a number'),
})

export const NwEntrySchema = Yup.object().shape({
    date: Yup.string()
        .required('Date is required')
        .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    items: Yup.array().of(NwItemSchema).min(1, 'At least one item is required'),
})

const RecurrenceSchema = Yup.object().shape({
    every: Yup.number()
        .min(1, 'Must be at least 1')
        .required('Required'),
    unit: Yup.string()
        .oneOf(['day', 'week', 'month', 'year'], 'Invalid unit')
        .required('Required'),
})

const RpItemSchema = Yup.object().shape({
    emoji: Yup.string().max(4, 'Emoji must be 4 characters or less'),
    name: Yup.string().required('Name is required').max(50, 'Name must be 50 characters or less'),
    unitPrice: Yup.number().min(0, 'Must be non-negative').required('Unit price is required'),
    quantity: Yup.number().min(1, 'Must be at least 1').required('Quantity is required'),
    recurrence: RecurrenceSchema,
    tag: Yup.string().max(30, 'Tag must be 30 characters or less'),
    referenceUrl: Yup.string().url('Must be a valid URL'),
})

export const RpFormSchema = Yup.object().shape({
    items: Yup.array().of(RpItemSchema),
})

const RecipeIngredientSchema = Yup.object().shape({
    name: Yup.string().required('Ingredient name is required').max(100, 'Name too long'),
    quantity: Yup.string().max(20, 'Quantity too long'),
    unit: Yup.string().max(20, 'Unit too long'),
})

const RecipeToolSchema = Yup.object().shape({
    name: Yup.string().required('Tool name is required').max(100, 'Name too long'),
})

export const RecipeFormSchema = Yup.object().shape({
    title: Yup.string().required('Recipe title is required').max(200, 'Title too long'),
    instructions: Yup.string(),
    ingredients: Yup.array().of(RecipeIngredientSchema),
    tools: Yup.array().of(RecipeToolSchema),
    prepTime: Yup.number().nullable().min(0, 'Prep time must be positive'),
    cost: Yup.number().nullable().min(1).max(5),
    dishesCost: Yup.number().nullable().min(1).max(5),
})

const BudgetExpenseSchema = Yup.object().shape({
    label: Yup.string().required('Label is required').max(50, 'Label must be 50 characters or less'),
    value: Yup.number().min(0, 'Must be non-negative').required('Value is required'),
    details: Yup.string().max(200, 'Details must be 200 characters or less'),
    tag: Yup.string().max(30, 'Tag must be 30 characters or less'),
})

const BudgetIncomeSchema = Yup.object().shape({
    label: Yup.string().required('Label is required').max(50, 'Label must be 50 characters or less'),
    value: Yup.number().min(0, 'Must be non-negative').required('Value is required'),
    deductionRate: Yup.number().min(0, 'Must be between 0 and 100').max(100, 'Must be between 0 and 100'),
    tag: Yup.string().max(30, 'Tag must be 30 characters or less'),
})

export const BudgetFormSchema = Yup.object().shape({
    expenses: Yup.array().of(BudgetExpenseSchema),
    incomes: Yup.array().of(BudgetIncomeSchema),
})

const SavingsProjectSchema = Yup.object().shape({
    title: Yup.string().required('Title is required').max(100, 'Title must be 100 characters or less'),
    objective: Yup.number().min(0, 'Must be non-negative').required('Objective is required'),
    startingValue: Yup.number().required('Starting value is required'),
    monthlyContributions: Yup.lazy(() => Yup.object()),
})

export const SavingsProjectsFormSchema = Yup.object().shape({
    projects: Yup.array().of(SavingsProjectSchema),
})
