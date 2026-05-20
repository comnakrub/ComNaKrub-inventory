export interface Part {
  id: number
  name: string
  category: string
  brand: string
  model: string
  package: string
  socket: string
  codename: string
  quantity: number
  costPrice: number
  sellPrice: number
  barcode: string | null
  imageUrl: string | null
  note: string
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
