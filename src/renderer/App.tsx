import { HashRouter as Router, Route, Routes } from 'react-router-dom'
import { TargetAllocationMaintenance } from './pages/TargetAllocationMaintenance'
import { CustomToaster, Layout } from './components'
import { OtherFeature } from './pages/OtherFeature'
import { NotFoundComponent } from './pages/NotFound'
import { AppProvider } from './context'

const App = () => {
    return (
        <AppProvider>
            <div className="flex h-full min-h-screen w-full flex-col bg-nobleBlack font-sans font-light text-softWhite">
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<TargetAllocationMaintenance />} />
                            <Route path="/tam" element={<TargetAllocationMaintenance />} />
                            <Route path="/other-feature" element={<OtherFeature />} />
                            <Route path="*" element={<NotFoundComponent />} />
                        </Routes>
                        <CustomToaster />
                    </Layout>
                </Router>
            </div>
        </AppProvider>
    )
}

export default App
