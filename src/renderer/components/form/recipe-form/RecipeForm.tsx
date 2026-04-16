import { useRef, useState } from 'react'
import { Formik, Form } from 'formik'
import { useSaveShortcut } from '../../../hooks/useSaveShortcut'
import { Eye, EyeOff, Clock, Euro, CookingPot } from 'lucide-react'
import toast from 'react-hot-toast'
import { Recipe } from '../../../utils/types'
import { RecipeFormSchema } from '../../../utils/form-validation'
import { Card } from '../../Card'
import { Button } from '../../Button'
import { RecipeIngredientList } from './RecipeIngredientList'
import { RecipeToolList } from './RecipeToolList'
import { RecipeMarkdownToolbar } from './RecipeMarkdownToolbar'
import { RecipeRatingInput } from './RecipeRatingInput'
import { RecipeMarkdownRenderer } from '../../recipe/RecipeMarkdownRenderer'

interface RecipeFormProps {
    recipe: Recipe | null
    onSave: (recipe: Recipe) => Promise<void>
    onCancel: () => void
}

export const RecipeForm = ({ recipe, onSave, onCancel }: RecipeFormProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const submitRef = useRef<{ dirty: boolean; handleSubmit: () => void } | null>(null)
    const [showPreview, setShowPreview] = useState(false)
    useSaveShortcut(() => { if (submitRef.current?.dirty) submitRef.current.handleSubmit() })

    const isNew = !recipe
    const now = new Date().toISOString()
    const initialValues: Omit<Recipe, 'id' | 'createdAt' | 'updatedAt'> & { id?: string; createdAt?: string; updatedAt?: string } = recipe
        ? { ...recipe }
        : {
            title: '',
            instructions: '',
            ingredients: [],
            tools: [],
            prepTime: null,
            cost: null,
            dishesCost: null,
        }

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={RecipeFormSchema}
            onSubmit={async (values) => {
                const recipeToSave: Recipe = {
                    id: recipe?.id ?? crypto.randomUUID(),
                    title: values.title,
                    instructions: values.instructions || '',
                    ingredients: values.ingredients || [],
                    tools: values.tools || [],
                    prepTime: values.prepTime ?? null,
                    cost: values.cost ?? null,
                    dishesCost: values.dishesCost ?? null,
                    createdAt: recipe?.createdAt ?? now,
                    updatedAt: new Date().toISOString(),
                }
                await onSave(recipeToSave)
                toast.success(isNew ? 'Recipe created' : 'Recipe updated')
            }}
        >
            {({ values, errors, dirty, setFieldValue, handleSubmit }) => {
                submitRef.current = { dirty, handleSubmit }
                return (
                <Form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Title */}
                    <input
                        type="text"
                        value={values.title}
                        onChange={(e) => setFieldValue('title', e.target.value)}
                        placeholder="Recipe title"
                        className="border-0 border-b border-lightGray bg-transparent p-2 font-serif text-2xl font-medium tracking-wider text-nobleGold placeholder-softWhite/30 focus:border-nobleGold focus:outline-none"
                    />
                    {errors.title && typeof errors.title === 'string' && (
                        <p className="text-sm text-error">{errors.title}</p>
                    )}

                    {/* Indicators row */}
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-nobleGold" />
                            <input
                                type="number"
                                value={values.prepTime ?? ''}
                                onChange={(e) => setFieldValue('prepTime', e.target.value === '' ? null : Number(e.target.value))}
                                placeholder="min"
                                min={0}
                                className="field w-20 text-center text-sm"
                            />
                            <span className="text-sm text-softWhite/50">min</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-softWhite/50">Cost</span>
                            <RecipeRatingInput
                                value={values.cost ?? null}
                                onChange={(v) => setFieldValue('cost', v)}
                                icon={<Euro size={16} className="text-nobleGold" />}
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-softWhite/50">Dishes</span>
                            <RecipeRatingInput
                                value={values.dishesCost ?? null}
                                onChange={(v) => setFieldValue('dishesCost', v)}
                                icon={<CookingPot size={16} className="text-nobleGold" />}
                            />
                        </div>
                    </div>

                    {/* Ingredients & Tools side by side */}
                    <div className="grid gap-5 lg:grid-cols-2">
                        <Card title="Ingredients">
                            <RecipeIngredientList
                                ingredients={values.ingredients || []}
                                onChange={(ingredients) => setFieldValue('ingredients', ingredients)}
                                errors={typeof errors.ingredients === 'object' ? errors.ingredients : undefined}
                            />
                        </Card>
                        <Card title="Tools">
                            <RecipeToolList
                                tools={values.tools || []}
                                onChange={(tools) => setFieldValue('tools', tools)}
                                errors={typeof errors.tools === 'object' ? errors.tools : undefined}
                            />
                        </Card>
                    </div>

                    {/* Instructions (Markdown editor) */}
                    <Card title="Instructions">
                        <div className="flex flex-col">
                            <div className="flex items-center justify-between">
                                <RecipeMarkdownToolbar
                                    textareaRef={textareaRef}
                                    value={values.instructions || ''}
                                    onChange={(v) => setFieldValue('instructions', v)}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="flex items-center gap-1 rounded px-2 py-1 text-xs text-softWhite/60 transition-colors hover:text-nobleGold"
                                >
                                    {showPreview ? <EyeOff size={14} /> : <Eye size={14} />}
                                    {showPreview ? 'Editor' : 'Preview'}
                                </button>
                            </div>
                            {showPreview ? (
                                <div className="min-h-[16rem] rounded-b-lg border border-lightGray bg-lightNobleBlack p-4">
                                    <RecipeMarkdownRenderer content={values.instructions || ''} />
                                </div>
                            ) : (
                                <textarea
                                    ref={textareaRef}
                                    value={values.instructions || ''}
                                    onChange={(e) => setFieldValue('instructions', e.target.value)}
                                    placeholder="Write your recipe instructions in Markdown..."
                                    className="min-h-[16rem] resize-y rounded-b-lg border border-lightGray bg-lightNobleBlack p-4 font-mono text-sm text-softWhite placeholder-softWhite/30 focus:border-nobleGold/50 focus:outline-none"
                                />
                            )}
                        </div>
                    </Card>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                        <Button type="submit" filled={dirty}>
                            {isNew ? 'Create' : 'Update'}
                        </Button>
                        <Button type="button" filled={false} onClick={onCancel}>
                            Cancel
                        </Button>
                    </div>
                </Form>
            )}}
        </Formik>
    )
}
