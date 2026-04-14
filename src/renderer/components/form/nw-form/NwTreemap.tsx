import { useRef, useCallback } from 'react'
import { NetWorthEntry, CURRENCIES } from '../../../utils'
import { Button } from '../../Button'
import { Download } from 'lucide-react'
import toast from 'react-hot-toast'

const AREA_PALETTE = [
    '#d4b85b',
    '#5b8fd4',
    '#5bd49a',
    '#d49a5b',
    '#9a5bd4',
    '#d45b5b',
    '#5bd4d4',
    '#d45bb8',
    '#8fd45b',
    '#5b5bd4',
]

interface NwTreemapProps {
    entry: NetWorthEntry | null
    currency: string
}

export const NwTreemap = ({ entry, currency }: NwTreemapProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const currencySymbol = CURRENCIES.get(currency) || currency

    const exportPng = useCallback(() => {
        const el = containerRef.current
        if (!el) return
        const rect = el.getBoundingClientRect()
        const scale = 2
        const canvas = document.createElement('canvas')
        canvas.width = rect.width * scale
        canvas.height = rect.height * scale
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        ctx.scale(scale, scale)
        // Draw background
        ctx.fillStyle = '#1a1a2e'
        ctx.fillRect(0, 0, rect.width, rect.height)
        // Draw each cell
        const cells = el.querySelectorAll<HTMLDivElement>('[data-treemap-cell]')
        cells.forEach((cell) => {
            const x = (Number.parseFloat(cell.style.left) / 100) * rect.width
            const y = (Number.parseFloat(cell.style.top) / 100) * rect.height
            const w = (Number.parseFloat(cell.style.width) / 100) * rect.width
            const h = (Number.parseFloat(cell.style.height) / 100) * rect.height
            const bg = cell.style.backgroundColor
            // Fill cell
            ctx.fillStyle = bg
            ctx.beginPath()
            ctx.roundRect(x + 1, y + 1, w - 2, h - 2, 4)
            ctx.fill()
            // Draw text
            ctx.fillStyle = '#fff'
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            const name = cell.dataset.name || ''
            const value = cell.dataset.value || ''
            const pct = cell.dataset.pct || ''
            const isLarge = w > rect.width * 0.18 && h > rect.height * 0.22
            ctx.font = 'bold 11px sans-serif'
            ctx.fillText(name, x + w / 2, y + h / 2 + (isLarge ? -10 : 0), w - 8)
            if (isLarge) {
                ctx.font = '10px sans-serif'
                ctx.globalAlpha = 0.9
                ctx.fillText(value, x + w / 2, y + h / 2 + 2, w - 8)
                ctx.font = '9px sans-serif'
                ctx.globalAlpha = 0.7
                ctx.fillText(pct, x + w / 2, y + h / 2 + 14, w - 8)
                ctx.globalAlpha = 1
            }
        })
        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png')
        link.download = 'asset-allocation.png'
        link.click()
        toast.success('Chart exported')
    }, [])

    if (!entry || entry.items.length === 0) {
        return (
            <div className="flex h-48 items-center justify-center">
                <p className="text-softWhite opacity-50">No items to display</p>
            </div>
        )
    }

    // Only show positive-value items in the treemap
    const positiveItems = entry.items
        .map((item, i) => ({ ...item, originalIndex: i }))
        .filter((item) => item.estimatedValue > 0)
        .sort((a, b) => b.estimatedValue - a.estimatedValue)

    if (positiveItems.length === 0) {
        return (
            <div className="flex h-48 items-center justify-center">
                <p className="text-softWhite opacity-50">No positive-value assets to display</p>
            </div>
        )
    }

    const total = positiveItems.reduce((sum, item) => sum + item.estimatedValue, 0)

    // Squarified treemap layout using the Bruls et al. algorithm
    const layout = squarify(
        positiveItems.map((item) => item.estimatedValue / total),
        { x: 0, y: 0, w: 100, h: 100 },
    )

    return (
        <div className="flex flex-col gap-3">
            <div className="flex justify-end">
                <Button onClick={exportPng} className="flex items-center gap-1 px-3">
                    <Download size={16} />
                    Export
                </Button>
            </div>
            <div className="mx-auto w-full max-w-[50%]">
                <div ref={containerRef} className="relative w-full" style={{ paddingBottom: '60%' }}>
                    <div className="absolute inset-0">
                        {positiveItems.map((item, i) => {
                            const rect = layout[i]
                            if (!rect) return null
                            const color = AREA_PALETTE[item.originalIndex % AREA_PALETTE.length]
                            const pct = ((item.estimatedValue / total) * 100).toFixed(1)
                            const yieldStr = item.estimatedYield ? `${item.estimatedYield}%` : null
                            const isLarge = rect.w > 18 && rect.h > 22

                            return (
                                <div
                                    key={item.id}
                                    data-treemap-cell
                                    data-name={item.name}
                                    data-value={`${item.estimatedValue.toLocaleString()} ${currencySymbol}`}
                                    data-pct={`${pct}%${yieldStr ? ` · yield ${yieldStr}` : ''}`}
                                    className="absolute flex flex-col items-center justify-center overflow-hidden rounded-md border border-black/20 p-1 text-center transition-opacity hover:opacity-90"
                                    style={{
                                        left: `${rect.x}%`,
                                        top: `${rect.y}%`,
                                        width: `${rect.w}%`,
                                        height: `${rect.h}%`,
                                        backgroundColor: color,
                                    }}
                                    title={`${item.name}: ${item.estimatedValue.toLocaleString()} ${currencySymbol} (${pct}%)${yieldStr ? ` — yield ${yieldStr}` : ''}`}
                                >
                                    <span className="truncate text-xs font-semibold leading-tight text-white drop-shadow-md" style={{ maxWidth: '95%' }}>
                                        {item.name}
                                    </span>
                                    {isLarge && (
                                        <>
                                            <span className="fin-value truncate text-xs font-medium leading-tight text-white/90 drop-shadow-md">
                                                {item.estimatedValue.toLocaleString()} {currencySymbol}
                                            </span>
                                            <span className="text-[10px] leading-tight text-white/70">
                                                {pct}%
                                                {yieldStr && (
                                                    <span className="ml-1 text-white/50">·  yield {yieldStr}</span>
                                                )}
                                            </span>
                                        </>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}

// --- Squarified treemap layout ---

interface Rect {
    x: number
    y: number
    w: number
    h: number
}

interface CellRect {
    x: number
    y: number
    w: number
    h: number
}

function squarify(values: number[], container: Rect): CellRect[] {
    if (values.length === 0) return []
    if (values.length === 1) return [{ ...container }]

    const results: CellRect[] = new Array(values.length)
    layoutRecursive(
        values.map((v, i) => ({ value: v, index: i })),
        container,
        results,
    )
    return results
}

function layoutRecursive(
    items: { value: number; index: number }[],
    rect: Rect,
    results: CellRect[],
) {
    if (items.length === 0) return
    if (items.length === 1) {
        results[items[0].index] = { x: rect.x, y: rect.y, w: rect.w, h: rect.h }
        return
    }

    const total = items.reduce((s, it) => s + it.value, 0)
    if (total <= 0) return

    // Determine layout direction based on shortest side
    const horizontal = rect.w >= rect.h
    const side = horizontal ? rect.h : rect.w

    let row: { value: number; index: number }[] = []
    let rowSum = 0
    let bestRatio = Infinity

    for (let i = 0; i < items.length; i++) {
        const testRow = [...row, items[i]]
        const testSum = rowSum + items[i].value
        const ratio = worstRatio(testRow.map((r) => r.value), testSum, total, side, horizontal ? rect.w : rect.h)

        if (ratio <= bestRatio) {
            row = testRow
            rowSum = testSum
            bestRatio = ratio
        } else {
            // Lay out current row and recurse on remainder
            const rowFraction = rowSum / total
            const rowSize = horizontal ? rect.w * rowFraction : rect.h * rowFraction

            let offset = 0
            for (const item of row) {
                const itemFraction = item.value / rowSum
                const itemSize = side * itemFraction
                if (horizontal) {
                    results[item.index] = { x: rect.x, y: rect.y + offset, w: rowSize, h: itemSize }
                } else {
                    results[item.index] = { x: rect.x + offset, y: rect.y, w: itemSize, h: rowSize }
                }
                offset += itemSize
            }

            const remaining = horizontal
                ? { x: rect.x + rowSize, y: rect.y, w: rect.w - rowSize, h: rect.h }
                : { x: rect.x, y: rect.y + rowSize, w: rect.w, h: rect.h - rowSize }

            layoutRecursive(items.slice(i), remaining, results)
            return
        }
    }

    // All items fit in one row
    let offset = 0
    const rowFraction = rowSum / total
    const rowSize = horizontal ? rect.w * rowFraction : rect.h * rowFraction
    for (const item of row) {
        const itemFraction = item.value / rowSum
        const itemSize = side * itemFraction
        if (horizontal) {
            results[item.index] = { x: rect.x, y: rect.y + offset, w: rowSize, h: itemSize }
        } else {
            results[item.index] = { x: rect.x + offset, y: rect.y, w: itemSize, h: rowSize }
        }
        offset += itemSize
    }
}

function worstRatio(
    rowValues: number[],
    rowSum: number,
    total: number,
    side: number,
    extent: number,
): number {
    const rowArea = (rowSum / total) * side * extent
    const rowSide = rowArea / side
    let worst = 0
    for (const v of rowValues) {
        const area = (v / total) * side * extent
        const itemSide = area / rowSide
        const ratio = Math.max(itemSide / rowSide, rowSide / itemSide)
        if (ratio > worst) worst = ratio
    }
    return worst
}
