// @ts-nocheck
import { ADD_PLAN_CONFIG } from "@components/admin/plans/AddPlanForm.constants"

export const getFieldsForStep = (stepIndex: number) => {
  return Object.keys(ADD_PLAN_CONFIG).filter((key) => {
    const field = ADD_PLAN_CONFIG[key]
    const belongsToStep = field.step === stepIndex

    const isRequired = !!field.rules?.required

    return belongsToStep && isRequired
  })
}
