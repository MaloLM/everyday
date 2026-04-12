import { useNavigate } from 'react-router-dom'
import { BarChartBig, ChefHat, ShoppingCart, Wallet } from 'lucide-react'

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
]

export const Home = () => {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center px-4 py-10">
            <h1 className="mb-2 font-serif text-4xl font-medium tracking-widest text-nobleGold">
                Everyday
            </h1>
            <p className="mb-12 text-softWhite/50">Your everyday personal toolkit</p>

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
