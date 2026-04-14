import { lazy, Suspense } from 'react'
import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import { CustomToaster } from './components/utils/CustomToaster'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { NotFoundComponent } from './pages/NotFound'
import { AppProvider } from './context'

const TargetAllocationMaintenance = lazy(() =>
    import('./pages/TargetAllocationMaintenance').then(m => ({ default: m.TargetAllocationMaintenance }))
)
const NetWorthAssessment = lazy(() =>
    import('./pages/NetWorthAssessment').then(m => ({ default: m.NetWorthAssessment }))
)
const RecurringPurchases = lazy(() =>
    import('./pages/RecurringPurchases').then(m => ({ default: m.RecurringPurchases }))
)
const Recipes = lazy(() =>
    import('./pages/Recipes').then(m => ({ default: m.Recipes }))
)
const Budgeting = lazy(() =>
    import('./pages/Budgeting').then(m => ({ default: m.Budgeting }))
)

const App = () => {
    return (
        <AppProvider>
            <div className="flex h-full min-h-screen w-full flex-col bg-nobleBlack font-sans font-light text-softWhite">
                <Router>
                    <Layout>
                        <Suspense fallback={null}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/tam" element={<TargetAllocationMaintenance />} />
                            <Route path="/nw" element={<NetWorthAssessment />} />
                            <Route path="/rp" element={<RecurringPurchases />} />
                            <Route path="/recipes" element={<Recipes />} />
                            <Route path="/budget" element={<Budgeting />} />
                            <Route path="*" element={<NotFoundComponent />} />
                        </Routes>
                        </Suspense>
                        <CustomToaster />
                    </Layout>
                </Router>
            </div>
        </AppProvider>
    )
}

export default App
