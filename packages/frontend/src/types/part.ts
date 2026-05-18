export const CATEGORIES = ['CPU', 'RAM', 'M.2', 'SSD', 'MAINBOARD', 'VGA', 'PSU', 'Monitor'] as const
export type Category = typeof CATEGORIES[number]

export interface Part {
  id: number
  name: string
  category: string
  brand: string
  model: string
  quantity: number
  costPrice: number
  sellPrice: number
  barcode: string | null
  imageUrl: string | null
  note: string

  // CPU
  cpuPackage?: string | null
  cpuSocket?: string | null
  cpuCodename?: string | null

  // RAM
  ramColor?: string | null
  ramRgb?: boolean
  ramPackage?: string | null
  ramMemoryType?: string | null
  ramBus?: number | null
  ramSize?: string | null

  // M.2
  m2Package?: string | null
  m2Type?: string | null
  m2Interface?: string | null
  m2Capacity?: string | null

  // SSD
  ssdPackage?: string | null
  ssdInterface?: string | null
  ssdCapacity?: string | null

  // MAINBOARD
  mbSize?: string | null
  mbSocket?: string | null
  mbChipset?: string | null
  mbSlotRam?: number | null
  mbSupportRam?: string | null

  // VGA
  vgaChipset?: string | null
  vgaFan?: number | null
  vgaSeries?: string | null
  vgaGpuModel?: string | null
  vgaMemory?: number | null

  // PSU
  psuCertification?: string | null
  psuWatt?: number | null

  // Monitor
  monitorSize?: number | null
  monitorColor?: string | null
  monitorPanel?: string | null
  monitorRes?: string | null
  monitorHz?: number | null

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
