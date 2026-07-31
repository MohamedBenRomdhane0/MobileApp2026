import { Media } from "./Media"

export interface Chapter {
  id: number
  courseId: number
  title: string
  description: string
  order: number
  media: Media[]
}