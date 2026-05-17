export const CATEGORIES = ['CPU', 'RAM', 'VGA', 'MB', 'PSU', 'CASE', 'Monitor', 'M.2', 'SSD', 'Cooler', 'FAN'] as const
export type Category = typeof CATEGORIES[number]

export interface Part {
  id: number
  name: string
  category: Category
  brand: string
  model: string
  quantity: number
  costPrice: number
  sellPrice: number
  barcode: string | null
  imageUrl: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface PartsMeta {
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface PartsResponse {
  data: Part[]
  meta: PartsMeta
}
