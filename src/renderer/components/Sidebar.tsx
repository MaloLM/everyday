import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlignJustify, AlignLeft, BarChartBig, PackagePlus } from 'lucide-react'

export const Sidebar = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false)
    const navigate = useNavigate()

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen)
    }

    const navigateToPath = (path) => {
        setSidebarOpen(false)
        navigate(path)
    }

    return (
        <>
            <button
                onClick={toggleSidebar}
                aria-controls="default-sidebar"
                type="button"
                className={`fixed top-2 z-50 mt-2 inline-flex items-center border border-lightNobleBlack bg-lightNobleBlack p-2
            text-sm text-softWhite transition-transform  duration-500 hover:border-nobleGold   focus:outline-none
            ${isSidebarOpen ? 'translate-x-64 rounded-l-none rounded-r-lg border-l-0 bg-nobleBlack xl:translate-x-72 ' : 'ms-3 rounded-lg '} `}
            >
                <span className="sr-only">{isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}</span>
                {isSidebarOpen ? <AlignJustify /> : <AlignLeft className={'text-nobleGold'} />}
            </button>
            <aside
                id="default-sidebar"
                className={`fixed left-0 top-0 z-40 h-screen w-64 transition-transform duration-500 xl:w-72 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} `}
                aria-label="Sidebar"
            >
                <div className="h-full overflow-y-auto border-r border-lightNobleBlack bg-nobleBlack  px-3 py-4">
                    <ul className="space-y-2 font-medium">
                        <li>
                            <a
                                onClick={() => navigateToPath('/tam')}
                                className="group flex cursor-pointer items-center rounded-lg p-2 text-softWhite hover:bg-lightNobleBlack hover:text-nobleGold"
                            >
                                <BarChartBig />
                                <span className="ms-3">Target Allocation Maintenance</span>
                            </a>
                        </li>
                        <li>
                            <a
                                onClick={() => navigateToPath('/other-feature')}
                                className="group flex cursor-pointer items-center rounded-lg p-2 text-softWhite hover:bg-lightNobleBlack hover:text-nobleGold "
                            >
                                <PackagePlus />
                                <span className="ms-3 flex-1 whitespace-nowrap">Other Feature</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </aside>
        </>
    )
}
