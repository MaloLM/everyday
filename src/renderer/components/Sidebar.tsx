import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AlignJustify, AlignLeft, BarChartBig, ChefHat, Eye, EyeOff, Home, PiggyBank, ShoppingCart, Wallet } from 'lucide-react'
import { useAppContext } from '../context'

const navItems: { path: string; altPaths: string[]; label: string; icon: typeof Home }[] = [
    { path: '/', altPaths: [], label: 'Home', icon: Home },
    { path: '/tam', altPaths: [], label: 'Target Allocation Maintenance', icon: BarChartBig },
    { path: '/nw', altPaths: [], label: 'Net Worth Assessment', icon: Wallet },
    { path: '/rp', altPaths: [], label: 'Recurring Purchases', icon: ShoppingCart },
    { path: '/recipes', altPaths: [], label: 'Recipes', icon: ChefHat },
    { path: '/budget', altPaths: [], label: 'Budgeting', icon: PiggyBank },
]

export const Sidebar = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false)
    const { blurFinances, toggleBlurFinances } = useAppContext()
    const navigate = useNavigate()
    const location = useLocation()

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen)
    }

    const navigateToPath = (path) => {
        setSidebarOpen(false)
        navigate(path)
    }

    const isActive = (item: (typeof navItems)[0]) =>
        location.pathname === item.path || item.altPaths.includes(location.pathname)

    return (
        <>
            <button
                onClick={toggleBlurFinances}
                type="button"
                title={blurFinances ? 'Show amounts' : 'Hide amounts'}
                className={`fixed right-3 top-3 z-50 rounded-lg border p-2 transition-colors
                    ${blurFinances
                        ? 'border-nobleGold/30 bg-nobleGold/10 text-nobleGold'
                        : 'border-lightNobleBlack bg-lightNobleBlack text-softWhite/50 hover:text-softWhite'
                    }`}
            >
                {blurFinances ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
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
                        {navItems.map((item) => {
                            const active = isActive(item)
                            const Icon = item.icon
                            return (
                                <li key={item.path}>
                                    <a
                                        onClick={() => navigateToPath(item.path)}
                                        className={`flex cursor-pointer items-center rounded-lg p-2.5
                                            ${active
                                                ? 'bg-nobleGold/15 text-nobleGold'
                                                : 'text-softWhite/70 hover:text-softWhite'
                                            }`}
                                    >
                                        <Icon size={20} className={active ? 'text-nobleGold' : 'opacity-60'} />
                                        <span className="ms-3">{item.label}</span>
                                    </a>
                                </li>
                            )
                        })}
                    </ul>
                    <div className="mt-auto border-t border-white/10 pt-3">
                        <button
                            onClick={toggleBlurFinances}
                            className={`flex w-full cursor-pointer items-center rounded-lg p-2.5 ${blurFinances ? 'text-nobleGold' : 'text-softWhite/70 hover:text-softWhite'}`}
                        >
                            {blurFinances ? <EyeOff size={20} /> : <Eye size={20} className="opacity-60" />}
                            <span className="ms-3">{blurFinances ? 'Show amounts' : 'Hide amounts'}</span>
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}
