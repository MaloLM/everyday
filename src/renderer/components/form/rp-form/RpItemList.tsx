import { useRef, useState } from 'react'
import { Button } from '../../Button'
import { Plus, GripVertical } from 'lucide-react'
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
    const [dragIndex, setDragIndex] = useState<number | null>(null)
    const [overIndex, setOverIndex] = useState<number | null>(null)

    const handleDragStart = (index: number) => (e: React.DragEvent) => {
        setDragIndex(index)
        e.dataTransfer.effectAllowed = 'move'
    }

    const handleDragOver = (index: number) => (e: React.DragEvent) => {
        e.preventDefault()
        e.dataTransfer.dropEffect = 'move'
        setOverIndex(index)
    }

    const handleDrop = (index: number) => (e: React.DragEvent) => {
        e.preventDefault()
        if (dragIndex === null || dragIndex === index) {
            setDragIndex(null)
            setOverIndex(null)
            return
        }
        const newItems = [...values.items]
        const [moved] = newItems.splice(dragIndex, 1)
        newItems.splice(index, 0, moved)
        setFieldValue('items', newItems)
        setDragIndex(null)
        setOverIndex(null)
    }

    const handleDragEnd = () => {
        setDragIndex(null)
        setOverIndex(null)
    }

    return (
        <div className="flex w-full flex-col">
            <div className="flex max-h-[28rem] w-full flex-col gap-1 overflow-y-auto py-1 pr-4 md:min-h-24">
                {values.items.map((item, index) => (
                    <div
                        ref={index === values.items.length - 1 ? lastItemRef : null}
                        key={item.id ?? index}
                        draggable
                        onDragStart={handleDragStart(index)}
                        onDragOver={handleDragOver(index)}
                        onDrop={handleDrop(index)}
                        onDragEnd={handleDragEnd}
                        className={`flex items-center gap-1 transition-opacity ${
                            dragIndex === index ? 'opacity-30' : ''
                        } ${overIndex === index && dragIndex !== index ? 'border-t-2 border-nobleGold' : ''}`}
                    >
                        <div className="cursor-grab active:cursor-grabbing shrink-0 text-softWhite/30 hover:text-softWhite/60">
                            <GripVertical size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
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
