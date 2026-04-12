import React from 'react'
import { Button } from '../../Button'
import { Plus } from 'lucide-react'
import { AssetForm } from './AssetForm'
import { Asset, CURRENCIES } from '../../../utils'
import toast from 'react-hot-toast'

interface AssetListProps {
    values: {
        assets: Asset[]
        budget: number
        currency: string
    }
    errors: any
    setFieldValue: (field: string, value: any) => void
}

const MAX_ASSETS = 30

export const AssetList = ({ values, errors, setFieldValue }: AssetListProps) => {
    const lastAssetRef = React.useRef<HTMLDivElement>(null)
    return (
        <div className="flex w-full flex-col">
            <div className="flex max-h-110 w-full flex-col gap-1  overflow-y-scroll py-1 pr-4 md:min-h-24">
                {values.assets.map((asset, index) => (
                    <div ref={index === values.assets.length - 1 ? lastAssetRef : null} key={asset.id ?? index}>
                        <AssetForm
                            currency={CURRENCIES.get(values.currency)}
                            assetIndex={index}
                            error={
                                (errors.assets && errors.assets[index]) !== undefined &&
                                typeof (errors.assets && errors.assets[index]) !== 'string'
                            }
                            onDelete={() => {
                                const newAssets = values.assets.filter((_, idx) => idx !== index)
                                setFieldValue('assets', newAssets)
                            }}
                        />
                    </div>
                ))}
                {values.assets.length === 0 && (
                    <div className="flex h-20 items-center justify-center">
                        <p className="text-softWhite">No assets added</p>
                    </div>
                )}
            </div>
            <div className="flex justify-between py-2">
                <Button
                    filled
                    className="flex w-fit items-center rounded-full pr-4"
                    onClick={() => AddAsset(setFieldValue, values, lastAssetRef)}
                >
                    <Plus size={20} />
                    Asset
                </Button>
            </div>
        </div>
    )
}

const AddAsset = (setFieldValue, values, lastAssetRef) => {
    if (values.assets.length >= MAX_ASSETS) {
        toast.error('Maximum number of assets reached')
        return
    }
    setFieldValue('assets', [
        ...values.assets,
        { id: crypto.randomUUID(), assetName: 'Asset Name', unitPrice: 1, quantityOwned: 0, targetPercent: 0 },
    ])

    requestAnimationFrame(() => {
        if (!lastAssetRef.current) return
        lastAssetRef.current.scrollIntoView({
            block: 'nearest',
            behavior: 'smooth',
        })
    })
}
