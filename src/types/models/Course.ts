import { CourseStatusEnum } from '@config/enums/courseStatus.enum'
import { CourseTypeEnum } from './../../config/enums/courseType.enum'
import { User } from './User'
import { Media } from './Media'
import { LevelMaterial } from './LevelMaterial'
import { Chapter } from './Chapter'
import { Level } from './Level'
import { Material } from './Material'

export interface Course {
  id: number
  user: User
  userId: number
  levelId: number
  level: Level
  material: Material
  materialId: number
  title: string
  description: string
  status: CourseStatusEnum
  type: CourseTypeEnum
  media: Media
  chapters?: Chapter[]
}
