
export const Loading = () => {
    return (
        <div className="relative flex h-full items-center justify-center">
            <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-nobleGold"></div>
            <h1 className="loading-text absolute text-lg font-bold text-nobleGold">Loading</h1>
        </div>
    )
}
