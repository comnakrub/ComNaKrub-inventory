import { useState, useEffect, useMemo } from 'react'
import { Search, Pencil, Trash2, Package, RefreshCw } from 'lucide-react'
import { Part, CATEGORIES } from '@/types/part'
import { formatCurrency } from '@/lib/utils'

const CATEGORY_COLORS: Record<string, string> = {
  CPU: 'bg-blue-100 text-blue-800',
  RAM: 'bg-green-100 text-green-800',
  VGA: 'bg-purple-100 text-purple-800',
  MAINBOARD: 'bg-orange-100 text-orange-800',
  PSU: 'bg-yellow-100 text-yellow-800',
  Monitor: 'bg-cyan-100 text-cyan-800',
  'M.2': 'bg-red-100 text-red-800',
  SSD: 'bg-pink-100 text-pink-800',
}

export default function InventoryPage() {
  const [parts, setParts] = useState<Part[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    fetchParts()
  }, [])

  const fetchParts = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/parts?limit=200')
      const json = await res.json()
      setParts(json.data || [])
    } catch (error) {
      console.error('Error fetching parts:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredParts = useMemo(() => {
    let filtered = parts

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(
        p =>
          p.name.toLowerCase().includes(searchLower) ||
          p.brand.toLowerCase().includes(searchLower) ||
          p.model.toLowerCase().includes(searchLower)
      )
    }

    return filtered
  }, [parts, selectedCategory, search])

  const stats = useMemo(() => {
    const totalCost = filteredParts.reduce((sum, p) => sum + p.costPrice * p.quantity, 0)
    const totalQty = filteredParts.reduce((sum, p) => sum + p.quantity, 0)
    return { totalCost, totalQty, count: filteredParts.length }
  }, [filteredParts])

  const handleDelete = async (id: number) => {
    if (!confirm('ต้องการลบรายการนี้หรือไม่?')) return
    try {
      await fetch(`/api/parts/${id}`, { method: 'DELETE' })
      setParts(parts.filter(p => p.id !== id))
    } catch (error) {
      console.error('Error deleting part:', error)
    }
  }

  const getCategoryDisplay = (part: Part) => {
    const details: string[] = []
    switch (part.category) {
      case 'CPU':
        if (part.cpuPackage) details.push(part.cpuPackage)
        if (part.cpuSocket) details.push(part.cpuSocket)
        if (part.cpuCodename) details.push(part.cpuCodename)
        break
      case 'RAM':
        if (part.ramPackage) details.push(part.ramPackage)
        if (part.ramMemoryType) details.push(part.ramMemoryType)
        if (part.ramBus) details.push(`${part.ramBus}MHz`)
        if (part.ramSize) details.push(part.ramSize)
        break
      case 'M.2':
        if (part.m2Package) details.push(part.m2Package)
        if (part.m2Type) details.push(part.m2Type)
        if (part.m2Interface) details.push(part.m2Interface)
        if (part.m2Capacity) details.push(part.m2Capacity)
        break
      case 'SSD':
        if (part.ssdPackage) details.push(part.ssdPackage)
        if (part.ssdInterface) details.push(part.ssdInterface)
        if (part.ssdCapacity) details.push(part.ssdCapacity)
        break
      case 'MAINBOARD':
        if (part.mbSize) details.push(part.mbSize)
        if (part.mbSocket) details.push(part.mbSocket)
        if (part.mbChipset) details.push(part.mbChipset)
        if (part.mbSlotRam) details.push(`${part.mbSlotRam}x`)
        break
      case 'VGA':
        if (part.vgaChipset) details.push(part.vgaChipset)
        if (part.vgaSeries) details.push(part.vgaSeries)
        if (part.vgaGpuModel) details.push(part.vgaGpuModel)
        if (part.vgaMemory) details.push(`${part.vgaMemory}GB`)
        break
      case 'PSU':
        if (part.psuWatt) details.push(`${part.psuWatt}W`)
        if (part.psuCertification) details.push(part.psuCertification)
        break
      case 'Monitor':
        if (part.monitorSize) details.push(`${part.monitorSize}"`)
        if (part.monitorPanel) details.push(part.monitorPanel)
        if (part.monitorRes) details.push(part.monitorRes)
        if (part.monitorHz) details.push(`${part.monitorHz}Hz`)
        break
      default:
        if (part.model) details.push(part.model)
    }
    return details.join(' • ') || part.model
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Inventory</h1>
        <p className="text-gray-600">
          {stats.count} รายการ · {stats.totalQty} ชิ้น · {formatCurrency(stats.totalCost)} บาท
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="ค้นหาชิ้นส่วน..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={fetchParts}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg flex items-center gap-2 transition"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            รีเฟรช
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1 rounded-full font-semibold transition ${
              selectedCategory === ''
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            ทั้งหมด
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : CATEGORY_COLORS[cat]
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Parts Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        {filteredParts.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Package size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">ไม่มีรายการชิ้นส่วน</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">ID</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">ชิ้นส่วน</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">ประเภท</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">ยี่ห้อ</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">รายละเอียด</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-900">จำนวน</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-900">ราคาต้นทุน</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-900">ราคาขาย</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900 w-20">การกระทำ</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredParts.map(part => {
                const displayText = getCategoryDisplay(part)
                return (
                  <tr key={part.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">{part.id}</td>
                    <td className="px-4 py-3 text-gray-900 max-w-xs">
                      <div className="font-medium truncate">{part.name}</div>
                      {part.note && (
                        <div className="text-xs text-gray-500 truncate">{part.note}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          CATEGORY_COLORS[part.category] || 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {part.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{part.brand}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-xs truncate">{displayText}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">{part.quantity}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(part.costPrice)}</td>
                    <td className="px-4 py-3 text-right text-gray-600">{formatCurrency(part.sellPrice)}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => window.location.href = `/parts/${part.id}/edit`}
                          className="p-1.5 hover:bg-blue-100 rounded text-blue-600 transition"
                          title="แก้ไข"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(part.id)}
                          className="p-1.5 hover:bg-red-100 rounded text-red-600 transition"
                          title="ลบ"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-1">รวมรายการ</p>
          <p className="text-2xl font-bold text-gray-900">{stats.count}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-1">จำนวนรวม</p>
          <p className="text-2xl font-bold text-gray-900">{stats.totalQty}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-1">มูลค่าต้นทุน</p>
          <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalCost)}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600 mb-1">หมวดหมู่</p>
          <p className="text-2xl font-bold text-gray-900">{CATEGORIES.length}</p>
        </div>
      </div>
    </div>
  )
}
