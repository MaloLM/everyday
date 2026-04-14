import { ReactNode } from 'react'
import { Sidebar } from './Sidebar'

interface LayoutProps {
    children?: ReactNode
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <div className="layout h-fit">
            <Sidebar />
            <main className="mt-10 min-w-fit p-5 sm:min-w-0 lg:mx-10 lg:mt-10 xl:mx-20 xl:mt-10">{children}</main>
        </div>
    )
}
