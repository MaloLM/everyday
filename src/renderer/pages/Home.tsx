import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { BarChartBig, ChefHat, Download, FileSpreadsheet, Gift, Landmark, PiggyBank, ShoppingCart, Upload, Wallet } from 'lucide-react'
import { ipc } from '../api/electron'
import { useAppContext } from '../context'
import toast from 'react-hot-toast'

const features = [
    {
        path: '/tam',
        icon: BarChartBig,
        title: 'Target Allocation',
        description: 'Optimize your investment portfolio. Set target allocations, track current positions, and compute your next buy to stay on target.',
    },
    {
        path: '/nw',
        icon: Wallet,
        title: 'Net Worth',
        description: 'Track your net worth over time. Record asset snapshots, visualize your financial evolution with interactive charts.',
    },
    {
        path: '/rp',
        icon: ShoppingCart,
        title: 'Recurring Purchases',
        description: 'Monitor recurring expenses across any frequency. Tag, filter, and see the annualized cost of every subscription.',
    },
    {
        path: '/recipes',
        icon: ChefHat,
        title: 'Recipes',
        description: 'Your personal cookbook. Save recipes with ingredients, tools, prep time, and markdown instructions.',
    },
    {
        path: '/budget',
        icon: PiggyBank,
        title: 'Budgeting',
        description: 'Plan your monthly budget. Track income and expenses, visualize with charts, and manage by tags.',
    },
    {
        path: '/sp',
        icon: Landmark,
        title: 'Savings Projects',
        description: 'Plan and track savings goals. Set objectives, monitor monthly contributions, and watch your projects grow over time.',
    },
    {
        path: '/ea',
        icon: FileSpreadsheet,
        title: 'Expense Analysis',
        description: 'Import bank CSV statements, tag and analyze transactions, visualize spending by category with charts.',
    },
    {
        path: '/gift-ideas',
        icon: Gift,
        title: 'Gift Ideas',
        description: 'Keep track of gift ideas. Add details in markdown, mark gifts as offered, and search through your list.',
    },
]

export const Home = () => {
    const navigate = useNavigate()
    const { exportAllData, importAllData, requestData: sendRequestData } = ipc
    const { refreshNwData, refreshRpData, refreshRecipesData, refreshBudgetData, refreshSpData, refreshEaData, refreshGiftIdeasData } = useAppContext()
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleExport = async () => {
        const data = await exportAllData()
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `everyday-export-${new Date().toISOString().slice(0, 10)}.json`
        document.body.appendChild(a)
        a.click()
        a.remove()
        URL.revokeObjectURL(url)
    }

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        try {
            const text = await file.text()
            const data = JSON.parse(text)
            await importAllData(data)
            sendRequestData()
            await Promise.all([refreshNwData(), refreshRpData(), refreshRecipesData(), refreshBudgetData(), refreshSpData(), refreshEaData(), refreshGiftIdeasData()])
            toast.success('Data imported successfully')
        } catch {
            toast.error('Failed to import data')
        }
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    return (
        <div className="flex flex-col items-center px-4 py-10">
            <div className="relative mb-2 flex w-full max-w-4xl flex-col items-center">
                <h1 className="font-serif text-4xl font-medium tracking-widest text-nobleGold">
                    Everyday
                </h1>
                <p className="mt-2 text-softWhite/50">Your everyday personal toolkit</p>
                <div className="absolute right-0 top-1 flex gap-2">
                    <div className="group relative flex justify-center">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            title="Import data"
                            className="rounded-full border border-nobleGold p-2 text-nobleGold transition-colors hover:bg-nobleGold hover:text-lightNobleBlack"
                        >
                            <Upload size={20} />
                        </button>
                        <span className="absolute top-11 z-50 scale-0 whitespace-nowrap rounded bg-nobleBlack p-2 text-xs text-softWhite group-hover:scale-100">
                            Import data
                        </span>
                    </div>
                    <div className="group relative flex justify-center">
                        <button
                            onClick={handleExport}
                            title="Export all data"
                            className="rounded-full border border-nobleGold p-2 text-nobleGold transition-colors hover:bg-nobleGold hover:text-lightNobleBlack"
                        >
                            <Download size={20} />
                        </button>
                        <span className="absolute top-11 z-50 scale-0 whitespace-nowrap rounded bg-nobleBlack p-2 text-xs text-softWhite group-hover:scale-100">
                            Export all data
                        </span>
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={handleImport}
                        data-testid="import-file-input"
                    />
                </div>
            </div>
            <div className="mb-12" />

            <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
                {features.map((feature) => {
                    const Icon = feature.icon
                    return (
                        <button
                            key={feature.path}
                            onClick={() => navigate(feature.path)}
                            className="group flex flex-col items-start rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition-all duration-300 hover:border-nobleGold/30 hover:bg-nobleGold/[0.06]"
                        >
                            <div className="mb-4 rounded-xl bg-nobleGold/10 p-3 transition-colors duration-300 group-hover:bg-nobleGold/20">
                                <Icon size={28} className="text-nobleGold" />
                            </div>
                            <h2 className="mb-2 text-lg font-medium text-softWhite">
                                {feature.title}
                            </h2>
                            <p className="text-sm leading-relaxed text-softWhite/50">
                                {feature.description}
                            </p>
                        </button>
                    )
                })}
            </div>
        </div>
    )
}
