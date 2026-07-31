export interface AccessibleEntity {
  id: number
  materialId: number
  accessibleType: string
  accessibleId: number
  createdAt?: string
  updatedAt?: string
}

export interface AvailableEntityItem {
  id: number
  title: string
  type: string
  levelMaterial?: {
    material: string | null
    level: string | null
  }
  material?: string | null
  level?: string | null
}

export interface AvailableEntityType {
  type: string
  label: string
  model: string
  items: AvailableEntityItem[]
}
