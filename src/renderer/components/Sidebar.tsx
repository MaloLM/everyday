import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { AlignJustify, AlignLeft, BarChartBig, PackagePlus, Wallet } from 'lucide-react'

const navItems = [
    { path: '/tam', altPaths: ['/'], label: 'Target Allocation Maintenance', icon: BarChartBig },
    { path: '/nw', altPaths: [], label: 'Net Worth Assessment', icon: Wallet },
    { path: '/other-feature', altPaths: [], label: 'Other Feature', icon: PackagePlus },
]

export const Sidebar = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false)
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
                </div>
            </aside>
        </>
    )
}
