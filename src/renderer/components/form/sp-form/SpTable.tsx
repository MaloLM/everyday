import { useState } from 'react'
import { SavingsProject } from '../../../utils/types'
import { SpProjectRow } from './SpProjectRow'
import { SpMonthCells } from './SpMonthCells'
import { CURRENCIES } from '../../../utils/constants'
import { Plus, GripVertical } from 'lucide-react'
import { useDragReorder } from '../../../hooks/useDragReorder'
import { ConfirmModal } from '../../ConfirmModal'

interface SpTableProps {
    projects: SavingsProject[]
    months: string[]
    currency: string
    onAdd: () => void
    onDelete: (index: number) => void
    onReorder: (fromIndex: number, toIndex: number) => void
}

const MAX_PROJECTS = 50

function formatMonthHeader(month: string): string {
    const [y, m] = month.split('-')
    const date = new Date(Number(y), Number(m) - 1)
    return date.toLocaleDateString('en', { month: 'short', year: '2-digit' })
}

export const SpTable = ({ projects, months, currency, onAdd, onDelete, onReorder }: SpTableProps) => {
    const currencySymbol = CURRENCIES.get(currency) || currency
    const { dragIndex, overIndex, dragHandlers } = useDragReorder(onReorder)
    const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null)
    const pendingProject = pendingDeleteIndex !== null ? projects[pendingDeleteIndex] : null

    if (projects.length === 0) {
        return (
            <div className="flex flex-col items-center gap-4 py-8 text-softWhite/50">
                <p>No savings projects yet.</p>
                <button
                    type="button"
                    onClick={onAdd}
                    className="flex items-center gap-2 rounded-lg border border-nobleGold/30 px-4 py-2 text-nobleGold transition-colors hover:bg-nobleGold/10"
                >
                    <Plus size={16} /> Add Project
                </button>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3">
            <ConfirmModal
                isOpen={pendingDeleteIndex !== null}
                title="Delete Project"
                message={pendingProject ? `Are you sure you want to delete "${pendingProject.title || 'Untitled project'}"? This action cannot be undone.` : ''}
                confirmLabel="Delete"
                onConfirm={() => { if (pendingDeleteIndex !== null) { onDelete(pendingDeleteIndex); setPendingDeleteIndex(null) } }}
                onCancel={() => setPendingDeleteIndex(null)}
                danger
            />
            <div className="flex min-w-0">
                {/* Fixed left columns */}
                <div className="shrink-0 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.4)]">
                    <table className="border-collapse">
                        <thead>
                            <tr className="h-10 text-xs uppercase tracking-wide text-softWhite/50">
                                <th className="w-6 px-0 py-2" />
                                <th className="px-1 py-2 text-left" />
                                <th className="px-1 py-2 text-left">Project</th>
                                <th className="px-1 py-2 text-center">Objective</th>
                                <th className="px-1 py-2 text-center">Total</th>
                                <th className="px-1 py-2 text-center">Starting</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project, index) => (
                                <tr
                                    key={project.id}
                                    {...dragHandlers(index)}
                                    className={`h-20 border-t border-white/5 transition-opacity ${
                                        dragIndex === index ? 'opacity-30' : ''
                                    } ${overIndex === index && dragIndex !== index ? 'border-t-2 border-nobleGold bg-nobleGold/10' : ''}`}
                                >
                                    <td className="w-6 px-0 py-1">
                                        <div className="cursor-grab active:cursor-grabbing shrink-0 text-softWhite/30 hover:text-softWhite/60">
                                            <GripVertical size={16} />
                                        </div>
                                    </td>
                                    <SpProjectRow
                                        index={index}
                                        project={project}
                                        currency={currency}
                                        onDelete={() => setPendingDeleteIndex(index)}
                                    />
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Scrollable month columns */}
                <div className="min-w-0 flex-1 overflow-x-auto">
                    <table className="border-collapse">
                        <thead>
                            <tr className="h-10 text-xs uppercase tracking-wide text-softWhite/50">
                                {months.map((month) => (
                                    <th key={month} className="whitespace-nowrap px-1 py-2 text-center">
                                        {formatMonthHeader(month)}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project, index) => (
                                <tr
                                    key={project.id}
                                    {...dragHandlers(index)}
                                    className={`h-20 border-t border-white/5 transition-opacity ${
                                        dragIndex === index ? 'opacity-30' : ''
                                    } ${overIndex === index && dragIndex !== index ? 'border-t-2 border-nobleGold bg-nobleGold/10' : ''}`}
                                >
                                    <SpMonthCells
                                        index={index}
                                        months={months}
                                        currencySymbol={currencySymbol}
                                    />
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {projects.length < MAX_PROJECTS && (
                <button
                    type="button"
                    onClick={onAdd}
                    className="flex items-center gap-2 self-start rounded-lg border border-dashed border-softWhite/20 px-3 py-1.5 text-sm text-softWhite/50 transition-colors hover:border-nobleGold/30 hover:text-nobleGold"
                >
                    <Plus size={14} /> Add Project
                </button>
            )}
        </div>
    )
}
