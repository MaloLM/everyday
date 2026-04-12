import { useRef } from 'react'
import { Button } from '../../Button'
import { Plus } from 'lucide-react'
import { NwItemForm } from './NwItemForm'
import { NetWorthItem, CURRENCIES } from '../../../utils'
import toast from 'react-hot-toast'

interface NwItemListProps {
    values: {
        items: NetWorthItem[]
        currency: string
    }
    errors: any
    setFieldValue: (field: string, value: any) => void
}

const MAX_ITEMS = 50

export const NwItemList = ({ values, errors, setFieldValue }: NwItemListProps) => {
    const lastItemRef = useRef<HTMLDivElement>(null)
    const total = values.items.reduce((sum, item) => sum + Number(item.estimatedValue), 0)

    return (
        <div className="flex w-full flex-col">
            <div className="flex max-h-80 w-full flex-col gap-1 overflow-y-auto py-1 pr-4 md:min-h-24">
                {values.items.map((item, index) => (
                    <div ref={index === values.items.length - 1 ? lastItemRef : null} key={item.id ?? index}>
                        <NwItemForm
                            currency={CURRENCIES.get(values.currency)}
                            itemIndex={index}
                            percentage={total !== 0 ? (Number(item.estimatedValue) / total) * 100 : null}
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
                        <p className="text-softWhite">No items added</p>
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
                    Item
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
        { id: crypto.randomUUID(), name: 'Item Name', estimatedValue: 0 },
    ])

    requestAnimationFrame(() => {
        if (!lastItemRef.current) return
        lastItemRef.current.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
        })
    })
}
