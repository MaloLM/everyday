import { useState, useCallback } from 'react'

interface DragHandlers {
    draggable: true
    onDragStart: (e: React.DragEvent) => void
    onDragOver: (e: React.DragEvent) => void
    onDrop: (e: React.DragEvent) => void
    onDragEnd: () => void
}

interface UseDragReorderReturn {
    dragIndex: number | null
    overIndex: number | null
    dragHandlers: (index: number) => DragHandlers
}

export function useDragReorder(onReorder: (fromIndex: number, toIndex: number) => void): UseDragReorderReturn {
    const [dragIndex, setDragIndex] = useState<number | null>(null)
    const [overIndex, setOverIndex] = useState<number | null>(null)

    const dragHandlers = useCallback((index: number): DragHandlers => ({
        draggable: true as const,
        onDragStart: (e: React.DragEvent) => {
            setDragIndex(index)
            e.dataTransfer.effectAllowed = 'move'
        },
        onDragOver: (e: React.DragEvent) => {
            e.preventDefault()
            e.dataTransfer.dropEffect = 'move'
            setOverIndex(index)
        },
        onDrop: (e: React.DragEvent) => {
            e.preventDefault()
            if (dragIndex === null || dragIndex === index) {
                setDragIndex(null)
                setOverIndex(null)
                return
            }
            onReorder(dragIndex, index)
            setDragIndex(null)
            setOverIndex(null)
        },
        onDragEnd: () => {
            setDragIndex(null)
            setOverIndex(null)
        },
    }), [dragIndex, onReorder])

    return { dragIndex, overIndex, dragHandlers }
}
