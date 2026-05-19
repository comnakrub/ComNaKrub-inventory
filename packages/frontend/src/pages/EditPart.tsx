import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Part } from '@/types/part'

export default function EditPartPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [part, setPart] = useState<Part | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPart()
  }, [id])

  const fetchPart = async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/parts/${id}`)
      if (!res.ok) throw new Error('Part not found')
      const data = await res.json()
      setPart(data)
    } catch (err) {
      setError('ไม่พบรายการนี้')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!part) return

    try {
      setSaving(true)
      const res = await fetch(`/api/parts/${part.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(part),
      })
      if (!res.ok) throw new Error('Save failed')
      navigate('/')
    } catch (err) {
      setError('บันทึกล้มเหลว')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (field: keyof Part, value: any) => {
    if (part) setPart({ ...part, [field]: value })
  }

  if (loading) return <div className="text-center py-12">กำลังโหลด...</div>
  if (error) {
    return (
      <div className="space-y-4">
        <div className="text-red-600 font-semibold">{error}</div>
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
        >
          <ArrowLeft size={16} />
          กลับไปยัง Inventory
        </button>
      </div>
    )
  }

  if (!part) return null

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg mb-6"
      >
        <ArrowLeft size={16} />
        กลับไปยัง Inventory
      </button>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">แก้ไขรายการ</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชิ้นส่วน</label>
              <input
                type="text"
                value={part.name}
                onChange={e => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ยี่ห้อ</label>
              <input
                type="text"
                value={part.brand}
                onChange={e => handleChange('brand', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">รุ่น</label>
              <input
                type="text"
                value={part.model}
                onChange={e => handleChange('model', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">หมายเหตุ</label>
              <input
                type="text"
                value={part.note}
                onChange={e => handleChange('note', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">จำนวน</label>
              <input
                type="number"
                value={part.quantity}
                onChange={e => handleChange('quantity', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ราคาต้นทุน</label>
              <input
                type="number"
                value={part.costPrice}
                onChange={e => handleChange('costPrice', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ราคาขาย</label>
              <input
                type="number"
                value={part.sellPrice}
                onChange={e => handleChange('sellPrice', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">บาร์โค้ด</label>
            <input
              type="text"
              value={part.barcode || ''}
              onChange={e => handleChange('barcode', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <div className="text-red-600 text-sm">{error}</div>}
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'กำลังบันทึก...' : 'บันทึก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
