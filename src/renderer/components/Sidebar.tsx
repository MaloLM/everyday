import { useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import { AlignJustify, AlignLeft, ArrowDownUp, BarChartBig, ChefHat, FileSpreadsheet, GripVertical, Home, Landmark, PiggyBank, ShoppingCart, Wallet } from 'lucide-react'
import { useAppContext } from '../context'
import { useDragReorder } from '../hooks/useDragReorder'

const navItems: { path: string; altPaths: string[]; label: string; icon: typeof Home }[] = [
    { path: '/', altPaths: [], label: 'Home', icon: Home },
    { path: '/tam', altPaths: [], label: 'Target Allocation Maintenance', icon: BarChartBig },
    { path: '/nw', altPaths: [], label: 'Net Worth Assessment', icon: Wallet },
    { path: '/rp', altPaths: [], label: 'Recurring Purchases', icon: ShoppingCart },
    { path: '/recipes', altPaths: [], label: 'Recipes', icon: ChefHat },
    { path: '/budget', altPaths: [], label: 'Budgeting', icon: PiggyBank },
    { path: '/sp', altPaths: [], label: 'Savings Projects', icon: Landmark },
    { path: '/ea', altPaths: [], label: 'Expense Analysis', icon: FileSpreadsheet },
]

const navItemsByPath = new Map(navItems.map((item) => [item.path, item]))

export const Sidebar = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false)
    const [reordering, setReordering] = useState(false)
    const { sidebarOrder, setSidebarOrder } = useAppContext()
    const navigate = useNavigate()
    const location = useLocation()

    const orderedItems = sidebarOrder.map((path) => navItemsByPath.get(path)).filter(Boolean)

    const toggleSidebar = () => {
        if (isSidebarOpen) setReordering(false)
        setSidebarOpen(!isSidebarOpen)
    }

    const navigateToPath = (path: string) => {
        if (isSidebarOpen) setSidebarOpen(false)
        navigate(path)
    }

    const isActive = (item: (typeof navItems)[0]) =>
        location.pathname === item.path || item.altPaths.includes(location.pathname) ||
        (item.path !== '/' && location.pathname.startsWith(item.path + '/'))

    const onReorder = useCallback((from: number, to: number) => {
        const newItems = [...orderedItems]
        const [moved] = newItems.splice(from, 1)
        newItems.splice(to, 0, moved)
        setSidebarOrder(newItems.map((item) => item.path))
    }, [orderedItems, setSidebarOrder])

    const [tooltip, setTooltip] = useState<{ label: string; top: number } | null>(null)

    const { dragIndex, overIndex, dragHandlers } = useDragReorder(onReorder)

    return (
        <>
            {isSidebarOpen && (
                <div className="fixed inset-0 z-30" onClick={() => { setReordering(false); setSidebarOpen(false) }} />
            )}
            <aside
                id="default-sidebar"
                className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ${isSidebarOpen ? 'w-64 xl:w-72' : 'w-16'}`}
                aria-label="Sidebar"
            >
                <div className="sidebar-glass flex h-full flex-col overflow-hidden border-r border-white/10 px-3 py-4">
                    <div className={`mb-4 flex items-center ${isSidebarOpen ? 'justify-between' : 'justify-center'}`}>
                        {isSidebarOpen && (
                            <div className="px-2.5 font-serif text-xl font-medium tracking-widest text-nobleGold">Everyday</div>
                        )}
                        <button
                            onClick={toggleSidebar}
                            type="button"
                            className="inline-flex items-center rounded-lg p-2 text-sm text-softWhite/70 hover:text-softWhite focus:outline-none"
                        >
                            <span className="sr-only">{isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}</span>
                            {isSidebarOpen ? <AlignJustify size={20} /> : <AlignLeft size={20} className="text-nobleGold" />}
                        </button>
                    </div>
                    <ul className="space-y-1 overflow-y-auto font-medium">
                        {orderedItems.map((item, index) => {
                            const active = isActive(item)
                            const Icon = item.icon
                            return (
                                <li
                                    key={item.path}
                                    {...(reordering && isSidebarOpen ? dragHandlers(index) : {})}
                                    className={`transition-opacity ${dragIndex === index ? 'opacity-30' : ''} ${overIndex === index && dragIndex !== index ? 'border-t-2 border-nobleGold' : ''}`}
                                >
                                    <a
                                        onClick={() => !reordering && navigateToPath(item.path)}
                                        onMouseEnter={(e) => {
                                            if (!isSidebarOpen) {
                                                const rect = e.currentTarget.getBoundingClientRect()
                                                setTooltip({ label: item.label, top: rect.top + rect.height / 2 })
                                            }
                                        }}
                                        onMouseLeave={() => setTooltip(null)}
                                        className={`flex cursor-pointer items-center whitespace-nowrap rounded-lg p-2.5
                                            ${!isSidebarOpen ? 'justify-center' : ''}
                                            ${active
                                                ? 'bg-nobleGold/15 text-nobleGold'
                                                : 'text-softWhite/70 hover:text-softWhite'
                                            }`}
                                    >
                                        {reordering && isSidebarOpen && (
                                            <div className="shrink-0 cursor-grab text-softWhite/30 hover:text-softWhite/60 active:cursor-grabbing">
                                                <GripVertical size={16} />
                                            </div>
                                        )}
                                        <Icon size={20} className={`shrink-0 ${reordering && isSidebarOpen ? 'ms-1' : ''} ${active ? 'text-nobleGold' : 'opacity-60'}`} />
                                        {isSidebarOpen && <span className="ms-3 truncate">{item.label}</span>}
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                    {isSidebarOpen && (
                        <div className="mt-auto border-t border-white/10 pt-3">
                            <button
                                onClick={() => setReordering((r) => !r)}
                                className={`flex w-full cursor-pointer items-center rounded-lg p-2.5 ${reordering ? 'text-nobleGold' : 'text-softWhite/70 hover:text-softWhite'}`}
                            >
                                <ArrowDownUp size={20} className={reordering ? '' : 'opacity-60'} />
                                <span className="ms-3">{reordering ? 'Done reordering' : 'Reorder menu'}</span>
                            </button>
                        </div>
                    )}
                </div>
            </aside>
            {tooltip && createPortal(
                <div
                    className="pointer-events-none fixed z-50 rounded-md bg-lightNobleBlack px-2.5 py-1.5 text-sm text-softWhite shadow-lg"
                    style={{ left: '4.5rem', top: tooltip.top, transform: 'translateY(-50%)' }}
                >
                    {tooltip.label}
                </div>,
                document.body,
            )}
        </>
    )
}
