import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'

interface LayoutProps {
    children?: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="layout h-fit">
            <Sidebar />
            <main className="ml-16 mt-10 min-w-fit p-5 sm:min-w-0 lg:mr-10 lg:mt-10 xl:mr-20 xl:mt-10">{children}</main>
        </div>
    )
}
