import { Translation } from './Translation'
import { PlanFeature } from './PlanFeature'
import { PlanPricing } from './PlanPricing'
import { Level } from './Level'
import { AccessibleEntity } from './PlanAccessibleEntity'

export interface Plan {
  id: number
  isPopular: boolean
  planType: string
  levelId: number
  hasMeeting?: boolean
  translations: Translation[]
  features: PlanFeature[]
  planPricings: PlanPricing[]
  level: Level
  createdAt: string
  updatedAt: string
  accessibleEntities: AccessibleEntity[]
}

export enum PlanTypeEnum {
  ANNEE_SCOLAIRE = 'ANNEE_SCOLAIRE',
  CONCOURS = 'CONCOURS',
}
