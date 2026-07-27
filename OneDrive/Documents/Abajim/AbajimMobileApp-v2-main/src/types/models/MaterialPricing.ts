import { Material } from "./Material"

export interface MaterialPricing {
    id: number
    planPricingId: number
    materialId: number
    material: Material
    price: number
    discount: number
    createdAt: string
    updatedAt: string
}