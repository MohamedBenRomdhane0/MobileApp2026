// @ts-nocheck
import { BookTypeEnum } from '@config/enums/BookTypeEnum'
import { Level } from './Level'
import { Material } from './Material'
import { Media, MediaApi } from './Media'
import { Icon, IconApi } from './Icon'
import { UserApi } from '@redux/apis/user/userApi.type'
import { User } from './User'

export interface Book {
  id: number
  levelMaterial: {
    id: number
    level: Level
    material: Material
  }
  title: string
  type: BookTypeEnum
  userId: number
  media: Media[]
  icons: Icon[]
  language?: string
  isValid?: boolean
  user: User
  pagesTotal?: number
  pages: any[]
  progress?: number
  pagesRendered?: number
  ingestStatus?: 'pending' | 'processing' | 'ready' | 'failed'

}
export interface BookApi {
  id: number
  level_material: {
    id: number
    level: Level
    material: Material
  }
  title: string
  type: BookTypeEnum
  user_id: number
  user: UserApi
  media: MediaApi[]
  icons: IconApi[]
  language?: string
  is_valid?: boolean
  progress?: number
  pages_total?: number
  pages_rendered?: number
  ingest_status?: 'pending' | 'processing' | 'ready' | 'failed'
  pages: BookPageApi[]

}

export interface BookPageApi {
  id: number
  page_number: number
  path_md: string
  path_lg: string
  path_thumb: string
  book_id: number
  created_at: string
  updated_at: string
  checksum: string
  disk: string
  width: number
  height: number
  size_bytes: number
  mime_type: string

}
