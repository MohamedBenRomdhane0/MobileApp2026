export interface Icon {
  id?: number | string
  bookId: number
  page: string
  x: number
  y: number
  iconType: string
  serverId?: string | null
  size: number
}
export interface IconApi {
  id?: number | string
  book_id: number
  page: string
  x: number
  y: number
  icon_type: string
  size: number
}
