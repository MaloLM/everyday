import { SavingsProject } from '../../../utils/types'
import { SpProjectRow } from './SpProjectRow'
import { SpMonthCells } from './SpMonthCells'
import { CURRENCIES } from '../../../utils/constants'
import { Plus } from 'lucide-react'

interface SpTableProps {
    projects: SavingsProject[]
    months: string[]
    currency: string
    onAdd: () => void
    onDelete: (index: number) => void
}

const MAX_PROJECTS = 50

function formatMonthHeader(month: string): string {
    const [y, m] = month.split('-')
    const date = new Date(Number(y), Number(m) - 1)
    return date.toLocaleDateString('en', { month: 'short', year: '2-digit' })
}

export const SpTable = ({ projects, months, currency, onAdd, onDelete }: SpTableProps) => {
    const currencySymbol = CURRENCIES.get(currency) || currency

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
            <div className="flex min-w-0">
                {/* Fixed left columns */}
                <div className="shrink-0 shadow-[4px_0_8px_-4px_rgba(0,0,0,0.4)]">
                    <table className="border-collapse">
                        <thead>
                            <tr className="h-10 text-xs uppercase tracking-wide text-softWhite/50">
                                <th className="px-1 py-2 text-left" />
                                <th className="px-1 py-2 text-left">Project</th>
                                <th className="px-1 py-2 text-center">Objective</th>
                                <th className="px-1 py-2 text-center">Total</th>
                                <th className="px-1 py-2 text-center">Starting</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project, index) => (
                                <tr key={project.id} className="h-20 border-t border-white/5">
                                    <SpProjectRow
                                        index={index}
                                        project={project}
                                        currency={currency}
                                        onDelete={() => onDelete(index)}
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
                                <tr key={project.id} className="h-20 border-t border-white/5">
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
