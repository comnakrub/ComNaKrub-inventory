import { useState, useEffect, useMemo } from 'react'
import { Search, Pencil, Trash2, Package, RefreshCw } from 'lucide-react'
import { Part } from '@/types/part'
import { formatCurrency } from '@/lib/utils'

export default function InventoryPage() {
  const [parts, setParts] = useState<Part[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

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
  }, [parts, search])

  const stats = useMemo(() => {
    const totalCost = filteredParts.reduce((sum, p) => sum + p.costPrice * p.quantity, 0)
    const totalQty = filteredParts.reduce((sum, p) => sum + p.quantity, 0)
    return { totalCost, totalQty, count: filteredParts.length }
  }, [filteredParts])

  const handleDelete = async (id: number) => {
    if (!confirm('ต้องการลบรายการนี้หรือไม่?')) return
    try {
      await fetch(`/api/parts/${id}`, { method: 'DELETE' })
      const deletedPart = parts.find(p => p.id === id)
      setParts(parts.filter(p => p.id !== id))

      // Show undo notification for 5 seconds
      if (deletedPart) {
        const showUndo = confirm(`ลบ "${deletedPart.name}" แล้ว\n\nกด OK เพื่อกู้คืน`)
        if (showUndo) {
          await fetch(`/api/parts/${id}/restore`, { method: 'POST' })
          fetchParts()
        }
      }
    } catch (error) {
      console.error('Error deleting part:', error)
    }
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
        <div className="flex gap-4">
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
                <th className="px-4 py-3 text-left font-semibold text-gray-900">ยี่ห้อ</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-900">รุ่น</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-900">จำนวน</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-900">ราคาต้นทุน</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-900">ราคาขาย</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-900 w-20">การกระทำ</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredParts.map(part => (
                <tr key={part.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-600 font-mono text-xs">{part.id}</td>
                  <td className="px-4 py-3 text-gray-900 max-w-xs">
                    <div className="font-medium truncate">{part.name}</div>
                    {part.note && (
                      <div className="text-xs text-gray-500 truncate">{part.note}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{part.brand}</td>
                  <td className="px-4 py-3 text-gray-500">{part.model}</td>
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
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
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
      </div>
    </div>
  )
}
