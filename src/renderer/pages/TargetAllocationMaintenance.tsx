import React, { useEffect, useState } from 'react'
import { parseToTamResponse, TamFormData, TamFormResponse } from '../utils'
import { useIpcRenderer } from '../api/electron'
import { Loading, TamForm } from '../components'
import toast from 'react-hot-toast'
import { useAppContext } from '../context'

export const TargetAllocationMaintenance = () => {
    const { tamData } = useAppContext()
    const [isLoading, setIsloading] = useState<boolean>(true)
    const [computeResult, setComputeResult] = useState<TamFormResponse>({} as TamFormResponse)
    const { sendWriteData, saveFormData } = useIpcRenderer()

    useEffect(() => {
        if (tamData && tamData.assets && tamData.budget && tamData.currency) {
            setIsloading(false)
        }
    }, [tamData])

    const saveConfig = (values) => {
        const { assets, budget, currency } = values
        const formData = {
            assets: assets,
            currency: currency,
            budget: parseFloat(budget),
        }
        saveFormData(formData)
        toast.success('Configuration saved')
    }

    const handleSubmit = async (formData: TamFormData) => {
        // make sure that numeric values are number type
        formData.budget = Number(formData.budget)
        formData.assets = formData.assets.map((asset) => {
            return {
                ...asset,
                quantityOwned: Number(asset.quantityOwned),
                targetPercent: Number(asset.targetPercent),
                unitPrice: Number(asset.unitPrice),
            }
        })

        try {
            const responseData = await sendWriteData(formData)
            let result = parseToTamResponse(responseData.message)
            result.assets = result.assets.map((asset) => {
                return {
                    ...asset,
                    newProp: Number(asset.newProp.toFixed(2)),
                }
            })
            setComputeResult(result)
        } catch (err) {
            toast.error('Optimization failed')
        }
    }

    return (
        <div className="flex h-full flex-col">
            {isLoading ? (
                <Loading />
            ) : (
                <TamForm
                    tamData={tamData}
                    onSubmit={handleSubmit}
                    computeResult={computeResult}
                    saveConfig={saveConfig}
                />
            )}
        </div>
    )
}
