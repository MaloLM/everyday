import { Toaster } from 'react-hot-toast'
import { COLORS } from '../../utils'

export const CustomToaster = () => {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
                duration: 5000,
                className: 'bg-nobleBlack  border border-nobleGold text-softWhite',
                iconTheme: {
                    primary: COLORS.nobleGold,
                    secondary: COLORS.softWhite,
                },
            }}
        />
    )
}
