import { useRef, useCallback } from 'react'
import { Button } from '../../Button'
import { Plus, GripVertical } from 'lucide-react'
import { RpItemForm } from './RpItemForm'
import { RecurringPurchaseItem, CURRENCIES } from '../../../utils'
import type { DisplayUnit } from '../../../utils/constants'
import { useDragReorder } from '../../../hooks/useDragReorder'
import toast from 'react-hot-toast'

interface RpItemListProps {
    values: {
        items: RecurringPurchaseItem[]
        currency: string
    }
    errors: any
    setFieldValue: (field: string, value: any) => void
    displayUnit: DisplayUnit
    activeTag?: string | null
}

const MAX_ITEMS = 100

export const RpItemList = ({ values, errors, setFieldValue, displayUnit, activeTag }: RpItemListProps) => {
    const lastItemRef = useRef<HTMLDivElement>(null)

    const onReorder = useCallback((from: number, to: number) => {
        const newItems = [...values.items]
        const [moved] = newItems.splice(from, 1)
        newItems.splice(to, 0, moved)
        setFieldValue('items', newItems)
    }, [values.items, setFieldValue])

    const { dragIndex, overIndex, dragHandlers } = useDragReorder(onReorder)

    return (
        <div className="flex w-full flex-col">
            <div className="flex max-h-[28rem] w-full flex-col gap-1 overflow-y-auto py-1 pr-4 md:min-h-24">
                {values.items.map((item, index) => {
                    const hidden = activeTag ? item.tag !== activeTag : false
                    return (
                    <div
                        ref={index === values.items.length - 1 ? lastItemRef : null}
                        key={item.id ?? index}
                        {...dragHandlers(index)}
                        className={`flex items-center gap-1 transition-opacity ${
                            dragIndex === index ? 'opacity-30' : ''
                        } ${overIndex === index && dragIndex !== index ? 'border-t-2 border-nobleGold' : ''} ${hidden ? 'hidden' : ''}`}
                    >
                        <div className="cursor-grab active:cursor-grabbing shrink-0 text-softWhite/30 hover:text-softWhite/60">
                            <GripVertical size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <RpItemForm
                                currency={CURRENCIES.get(values.currency)}
                                itemIndex={index}
                                displayUnit={displayUnit}
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
                    </div>
                    )
                })}
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
            referenceUrl: '',
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
