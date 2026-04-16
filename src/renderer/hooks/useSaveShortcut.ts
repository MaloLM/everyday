import { useEffect, useRef } from 'react'

/**
 * Registers a Cmd+S / Ctrl+S keyboard shortcut that calls the provided save function.
 * Uses a ref internally so the listener always calls the latest callback without re-registering.
 */
export const useSaveShortcut = (onSave: () => void) => {
    const ref = useRef(onSave)
    ref.current = onSave

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault()
                ref.current()
            }
        }
        globalThis.addEventListener('keydown', handler)
        return () => globalThis.removeEventListener('keydown', handler)
    }, [])
}
