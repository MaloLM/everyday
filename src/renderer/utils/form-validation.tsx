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
})

export const RpFormSchema = Yup.object().shape({
    items: Yup.array().of(RpItemSchema),
})
