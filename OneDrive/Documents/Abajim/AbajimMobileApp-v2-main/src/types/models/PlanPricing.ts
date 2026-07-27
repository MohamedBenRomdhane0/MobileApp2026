import { StatusEnum } from '@config/enums/status.enum'
import { PricingType } from '@config/enums/pricingType.enum'
import { MaterialPricing } from './MaterialPricing'

export interface PlanPricing {
  id: number
  planId: number
  price: number
  discount: number
  months: number
  status: StatusEnum
  isHighlighted: boolean
  pricingType: PricingType
  materialPricings?: MaterialPricing[]
  createdAt: string
  updatedAt: string
}
