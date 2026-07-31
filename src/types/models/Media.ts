import { MediaTagEnum } from '@config/enums/MediaTag.enum'
import { MediaMetadataApi } from 'types/interfaces/MediaMetadata'
import { MediaMetadata } from 'types/interfaces/MediaMetadata'

export interface Media {
  id: number
  modelType: string
  modelId: number
  fileName: string
  mimeType: string
  filePath?: string
  title: string
  description?: string
  size?: number
  tag: MediaTagEnum
  metadata: MediaMetadata
  thumbnail: string | null
  creatorId?: number
}

export interface MediaApi {
  id: number
  model_type: string
  model_id: number
  file_name: string
  mime_type: string
  file_path?: string
  title: string
  description?: string
  size?: number
  tag: MediaTagEnum
  metadata: MediaMetadataApi
  thumbnail: string | null
  creator_id?: number
}
