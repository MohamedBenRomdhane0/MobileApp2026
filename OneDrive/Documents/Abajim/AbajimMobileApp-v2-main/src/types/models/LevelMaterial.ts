export interface LevelMaterial {
  id: number
  levelId: number
  materialId: number
  level: {
    id: number
    name: string
  }
  material: {
    id: number
    name: string
  }
}
