import { Media } from './Media'
import { Child } from './Child'
import { StatusEnum } from '@config/enums/status.enum'

export interface User {
  id: number
  fullName: string
  email: string
  address?: string
  role?: string
  roles?: any
  permissions?: string[]
  rolesData?: {
    name?: string
    roles?: any
    permissions?: string[]
  }

  followers?: number
  isValid?: 0 | 1
  media?: Media[]
  createdAt?: string
  password?: string
  passwordConfirmation?: string
  phone?: string
  teacherProfile?: {
    bio?: string
    about?: string
    education?: string
    experience?: string
    isValid: boolean
    isValidFinancial: boolean
  }
  parentProfile?: {
    address?: string
    guideProgress?: string[]
    media: Media[]
    children?: Child[]
  }
  teacherLevelMaterials: {
    id: number
    levelMaterial?: {
      id: number
      level: {
        id: number
        name: string
      }
      material: {
        id: number
        name: string
      }
    }
  }[]
  status: StatusEnum
}
