interface ConfirmModalProps {
    isOpen: boolean
    title: string
    message: string
    confirmLabel?: string
    cancelLabel?: string
    onConfirm: () => void
    onCancel: () => void
    danger?: boolean
}

export const ConfirmModal = ({
    isOpen,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    onConfirm,
    onCancel,
    danger = false,
}: ConfirmModalProps) => {
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
        >
            <div
                className="mx-4 w-full max-w-md rounded-xl border border-white/10 bg-lightNobleBlack p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="mb-2 font-serif text-xl text-nobleGold">{title}</h2>
                <p className="mb-6 text-sm text-softWhite/70">{message}</p>
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-softWhite/20 px-4 py-2 text-sm text-softWhite/70 transition-colors hover:border-softWhite/40 hover:text-softWhite"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                            danger
                                ? 'bg-error text-white hover:brightness-110'
                                : 'bg-nobleGold text-nobleBlack hover:brightness-110'
                        }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}
