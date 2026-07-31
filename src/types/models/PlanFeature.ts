import { Translation } from './Translation'

export interface PlanFeature {
  id: number
  isAvailable: boolean
  translations: Translation[]
  descriptions?: Translation[]
  createdAt: string
  updatedAt: string
}
