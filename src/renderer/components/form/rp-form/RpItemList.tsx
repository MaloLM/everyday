import { useRef } from 'react'
import { Button } from '../../Button'
import { Plus } from 'lucide-react'
import { RpItemForm } from './RpItemForm'
import { RecurringPurchaseItem, CURRENCIES } from '../../../utils'
import toast from 'react-hot-toast'

interface RpItemListProps {
    values: {
        items: RecurringPurchaseItem[]
        currency: string
    }
    errors: any
    setFieldValue: (field: string, value: any) => void
}

const MAX_ITEMS = 100

export const RpItemList = ({ values, errors, setFieldValue }: RpItemListProps) => {
    const lastItemRef = useRef<HTMLDivElement>(null)
    return (
        <div className="flex w-full flex-col">
            <div className="flex max-h-[28rem] w-full flex-col gap-1 overflow-y-auto py-1 pr-4 md:min-h-24">
                {values.items.map((item, index) => (
                    <div ref={index === values.items.length - 1 ? lastItemRef : null} key={item.id ?? index}>
                        <RpItemForm
                            currency={CURRENCIES.get(values.currency)}
                            itemIndex={index}
                            error={
                                (errors.items && errors.items[index]) !== undefined &&
                                typeof (errors.items && errors.items[index]) !== 'string'
                            }
                            onDelete={() => {
                                const newItems = values.items.filter((_, idx) => idx !== index)
                                setFieldValue('items', newItems)
                            }}
                        />
                    </div>
                ))}
                {values.items.length === 0 && (
                    <div className="flex h-20 items-center justify-center">
                        <p className="text-softWhite">No purchases added</p>
                    </div>
                )}
            </div>
            <div className="flex justify-between py-2">
                <Button
                    filled
                    className="flex w-fit items-center rounded-full pr-4"
                    onClick={() => addItem(setFieldValue, values, lastItemRef)}
                >
                    <Plus size={20} />
                    Purchase
                </Button>
            </div>
        </div>
    )
}

const addItem = (setFieldValue, values, lastItemRef) => {
    if (values.items.length >= MAX_ITEMS) {
        toast.error('Maximum number of items reached')
        return
    }
    setFieldValue('items', [
        ...values.items,
        {
            id: crypto.randomUUID(),
            emoji: '',
            name: '',
            unitPrice: 0,
            quantity: 1,
            recurrence: { every: 1, unit: 'month' },
            tag: '',
        },
    ])

    requestAnimationFrame(() => {
        if (!lastItemRef.current) return
        lastItemRef.current.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
        })
    })
}
