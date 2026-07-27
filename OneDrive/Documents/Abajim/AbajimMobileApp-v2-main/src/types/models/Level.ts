import { Material } from './Material'

export interface Level {
  id: number
  name: string
  materials: Material[]
}
