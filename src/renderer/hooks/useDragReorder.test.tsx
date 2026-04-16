import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDragReorder } from './useDragReorder'

describe('useDragReorder', () => {
    const mockPreventDefault = vi.fn()
    const makeDragEvent = (overrides = {}) => ({
        preventDefault: mockPreventDefault,
        dataTransfer: { effectAllowed: '', dropEffect: '' },
        ...overrides,
    }) as unknown as React.DragEvent

    it('initializes with null dragIndex and overIndex', () => {
        const onReorder = vi.fn()
        const { result } = renderHook(() => useDragReorder(onReorder))

        expect(result.current.dragIndex).toBeNull()
        expect(result.current.overIndex).toBeNull()
    })

    it('returns dragHandlers function', () => {
        const onReorder = vi.fn()
        const { result } = renderHook(() => useDragReorder(onReorder))

        const handlers = result.current.dragHandlers(0)
        expect(handlers.draggable).toBe(true)
        expect(typeof handlers.onDragStart).toBe('function')
        expect(typeof handlers.onDragOver).toBe('function')
        expect(typeof handlers.onDrop).toBe('function')
        expect(typeof handlers.onDragEnd).toBe('function')
    })

    it('sets dragIndex on dragStart', () => {
        const onReorder = vi.fn()
        const { result } = renderHook(() => useDragReorder(onReorder))

        act(() => {
            result.current.dragHandlers(2).onDragStart(makeDragEvent())
        })

        expect(result.current.dragIndex).toBe(2)
    })

    it('sets overIndex on dragOver and calls preventDefault', () => {
        const onReorder = vi.fn()
        const { result } = renderHook(() => useDragReorder(onReorder))

        act(() => {
            result.current.dragHandlers(3).onDragOver(makeDragEvent())
        })

        expect(result.current.overIndex).toBe(3)
        expect(mockPreventDefault).toHaveBeenCalled()
    })

    it('calls onReorder and resets state on drop', () => {
        const onReorder = vi.fn()
        const { result } = renderHook(() => useDragReorder(onReorder))

        // Start drag from index 1
        act(() => {
            result.current.dragHandlers(1).onDragStart(makeDragEvent())
        })
        expect(result.current.dragIndex).toBe(1)

        // Drop on index 3
        act(() => {
            result.current.dragHandlers(3).onDrop(makeDragEvent())
        })

        expect(onReorder).toHaveBeenCalledWith(1, 3)
        expect(result.current.dragIndex).toBeNull()
        expect(result.current.overIndex).toBeNull()
    })

    it('does not call onReorder when dropping on same index', () => {
        const onReorder = vi.fn()
        const { result } = renderHook(() => useDragReorder(onReorder))

        act(() => {
            result.current.dragHandlers(2).onDragStart(makeDragEvent())
        })
        act(() => {
            result.current.dragHandlers(2).onDrop(makeDragEvent())
        })

        expect(onReorder).not.toHaveBeenCalled()
        expect(result.current.dragIndex).toBeNull()
        expect(result.current.overIndex).toBeNull()
    })

    it('does not call onReorder when dragIndex is null (no drag started)', () => {
        const onReorder = vi.fn()
        const { result } = renderHook(() => useDragReorder(onReorder))

        act(() => {
            result.current.dragHandlers(2).onDrop(makeDragEvent())
        })

        expect(onReorder).not.toHaveBeenCalled()
    })

    it('resets state on dragEnd (cancel)', () => {
        const onReorder = vi.fn()
        const { result } = renderHook(() => useDragReorder(onReorder))

        act(() => {
            result.current.dragHandlers(1).onDragStart(makeDragEvent())
        })
        act(() => {
            result.current.dragHandlers(3).onDragOver(makeDragEvent())
        })

        expect(result.current.dragIndex).toBe(1)
        expect(result.current.overIndex).toBe(3)

        act(() => {
            result.current.dragHandlers(1).onDragEnd()
        })

        expect(result.current.dragIndex).toBeNull()
        expect(result.current.overIndex).toBeNull()
        expect(onReorder).not.toHaveBeenCalled()
    })
})
