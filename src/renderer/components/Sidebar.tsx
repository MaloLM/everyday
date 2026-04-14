import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AlignJustify, AlignLeft, ArrowDownUp, BarChartBig, ChefHat, GripVertical, Home, PiggyBank, ShoppingCart, Wallet } from 'lucide-react'
import { useAppContext } from '../context'

const navItems: { path: string; altPaths: string[]; label: string; icon: typeof Home }[] = [
    { path: '/', altPaths: [], label: 'Home', icon: Home },
    { path: '/tam', altPaths: [], label: 'Target Allocation Maintenance', icon: BarChartBig },
    { path: '/nw', altPaths: [], label: 'Net Worth Assessment', icon: Wallet },
    { path: '/rp', altPaths: [], label: 'Recurring Purchases', icon: ShoppingCart },
    { path: '/recipes', altPaths: [], label: 'Recipes', icon: ChefHat },
    { path: '/budget', altPaths: [], label: 'Budgeting', icon: PiggyBank },
]

const navItemsByPath = new Map(navItems.map((item) => [item.path, item]))

export const Sidebar = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false)
    const [reordering, setReordering] = useState(false)
    const [dragIndex, setDragIndex] = useState<number | null>(null)
    const [overIndex, setOverIndex] = useState<number | null>(null)
    const { sidebarOrder, setSidebarOrder } = useAppContext()
    const navigate = useNavigate()
    const location = useLocation()

    const orderedItems = sidebarOrder.map((path) => navItemsByPath.get(path)).filter(Boolean)

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen)
    }

    const navigateToPath = (path) => {
        setSidebarOpen(false)
        navigate(path)
    }

    const isActive = (item: (typeof navItems)[0]) =>
        location.pathname === item.path || item.altPaths.includes(location.pathname)

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
        const newItems = [...orderedItems]
        const [moved] = newItems.splice(dragIndex, 1)
        newItems.splice(index, 0, moved)
        setSidebarOrder(newItems.map((item) => item.path))
        setDragIndex(null)
        setOverIndex(null)
    }

    const handleDragEnd = () => {
        setDragIndex(null)
        setOverIndex(null)
    }

    return (
        <>
            {isSidebarOpen && (
                <div className="fixed inset-0 z-30" onClick={() => setSidebarOpen(false)} />
            )}
            <button
                onClick={toggleSidebar}
                onMouseEnter={() => { if (!isSidebarOpen) setSidebarOpen(true) }}
                aria-controls="default-sidebar"
                type="button"
                className={`fixed top-2 z-50 mt-2 inline-flex items-center border p-2
                    text-sm text-softWhite transition-transform duration-500 focus:outline-none
                    ${isSidebarOpen
                        ? 'translate-x-64 rounded-l-none rounded-r-lg border-l-0 border-white/10 bg-white/5 backdrop-blur-xl xl:translate-x-72'
                        : 'ms-3 rounded-lg border-lightNobleBlack bg-lightNobleBlack'
                    }`}
            >
                <span className="sr-only">{isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}</span>
                {isSidebarOpen ? <AlignJustify /> : <AlignLeft className={'text-nobleGold'} />}
            </button>
            <aside
                id="default-sidebar"
                className={`fixed left-0 top-0 z-40 h-screen w-64 transition-transform duration-500 xl:w-72 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                aria-label="Sidebar"
            >
                <div className="sidebar-glass flex h-full flex-col overflow-y-auto border-r border-white/10 px-3 py-4">
                    <div className="mb-4 px-2.5 font-serif text-xl font-medium tracking-widest text-nobleGold">Everyday</div>
                    <ul className="space-y-1 font-medium">
                        {orderedItems.map((item, index) => {
                            const active = isActive(item)
                            const Icon = item.icon
                            return (
                                <li
                                    key={item.path}
                                    draggable={reordering}
                                    onDragStart={reordering ? handleDragStart(index) : undefined}
                                    onDragOver={reordering ? handleDragOver(index) : undefined}
                                    onDrop={reordering ? handleDrop(index) : undefined}
                                    onDragEnd={reordering ? handleDragEnd : undefined}
                                    className={`transition-opacity ${dragIndex === index ? 'opacity-30' : ''} ${overIndex === index && dragIndex !== index ? 'border-t-2 border-nobleGold' : ''}`}
                                >
                                    <a
                                        onClick={() => !reordering && navigateToPath(item.path)}
                                        className={`flex cursor-pointer items-center rounded-lg p-2.5
                                            ${active
                                                ? 'bg-nobleGold/15 text-nobleGold'
                                                : 'text-softWhite/70 hover:text-softWhite'
                                            }`}
                                    >
                                        {reordering && (
                                            <div className="shrink-0 cursor-grab text-softWhite/30 hover:text-softWhite/60 active:cursor-grabbing">
                                                <GripVertical size={16} />
                                            </div>
                                        )}
                                        <Icon size={20} className={`${reordering ? 'ms-1' : ''} ${active ? 'text-nobleGold' : 'opacity-60'}`} />
                                        <span className="ms-3">{item.label}</span>
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                    <div className="mt-auto border-t border-white/10 pt-3">
                        <button
                            onClick={() => setReordering((r) => !r)}
                            className={`flex w-full cursor-pointer items-center rounded-lg p-2.5 ${reordering ? 'text-nobleGold' : 'text-softWhite/70 hover:text-softWhite'}`}
                        >
                            <ArrowDownUp size={20} className={reordering ? '' : 'opacity-60'} />
                            <span className="ms-3">{reordering ? 'Done reordering' : 'Reorder menu'}</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}
