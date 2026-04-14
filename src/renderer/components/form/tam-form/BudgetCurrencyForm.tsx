import { CURRENCIES, TamFormResponse } from '../../../utils'
import { SelectorField } from '../SelectorField'
import { NumberField } from '../NumberField'
import { Button } from '../../Button'
import { RotateCcw } from 'lucide-react'

interface BudgetCurrencyFormProps {
    computeResult: TamFormResponse
    handleUpdate: () => void
}

export const BudgetCurrencyForm = ({ computeResult, handleUpdate }: BudgetCurrencyFormProps) => {
    return (
        <div className="flex items-center">
            <p className="text-softWhite">Budget</p>
            <NumberField
                className=" max-w-24  text-center text-xl fin-value"
                name="budget"
                tooltip="Enter budget"
                displayError
            />
            <SelectorField title="Currency" name="currency" options={Array.from(CURRENCIES.keys())} />

            {computeResult.assets && (
                <>
                    <Button title="Recompute" filled className="ml-3 bg-lightNobleBlack py-1" type="submit">
                        <RotateCcw size={20} strokeWidth={2.5} />
                    </Button>
                    <Button
                        className="ml-3 bg-lightNobleBlack py-1 text-sm md:text-base"
                        onClick={() => handleUpdate()}
                    >
                        Update Config
                    </Button>
                </>
            )}
        </div>
    )
}
