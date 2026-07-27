export interface Translation {
  id?: number
  locale: string
  text: string
  key?: string
  modelType?: string
  modelId?: number
}

export interface TranslationApi {
  id: number
  locale: string
  text: string
  key?: string
  model_type?: string
  model_id?: number
}
