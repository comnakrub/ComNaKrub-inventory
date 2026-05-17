import { useState, useEffect, useCallback } from 'react'
import { Search, Plus, Pencil, Trash2, Package, RefreshCw, X } from 'lucide-react'
import { Part, Category, CATEGORIES, PartsResponse } from '@/types/part'
import { cn, formatCurrency } from '@/lib/utils'

const CATEGORY_COLORS: Record<Category, string> = {
  CPU: 'bg-blue-100 text-blue-800',
  RAM: 'bg-green-100 text-green-800',
  VGA: 'bg-purple-100 text-purple-800',
  MB: 'bg-orange-100 text-orange-800',
  PSU: 'bg-yellow-100 text-yellow-800',
  CASE: 'bg-gray-100 text-gray-800',
  Monitor: 'bg-cyan-100 text-cyan-800',
  'M.2': 'bg-red-100 text-red-800',
  SSD: 'bg-pink-100 text-pink-800',
  Cooler: 'bg-indigo-100 text-indigo-800',
  FAN: 'bg-teal-100 text-teal-800',
}

const EMPTY_FORM = {
  name: '',
  category: 'CPU' as Category,
  brand: '',
  model: '',
  quantity: 0,
  costPrice: 0,
  sellPrice: 0,
  barcode: '',
}

type FormData = typeof EMPTY_FORM

function PartDialog({
  part,
  onClose,
  onSaved,
}: {
  part: Part | null
  onClose: () => void
  onSaved: () => void
}) {
  const [form, setForm] = useState<FormData>(
    part
      ? {
          name: part.name,
          category: part.category,
          brand: part.brand,
          model: part.model,
          quantity: part.quantity,
          costPrice: part.costPrice,
          sellPrice: part.sellPrice,
          barcode: part.barcode ?? '',
        }
      : EMPTY_FORM
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const set = (field: keyof FormData, value: string | number) =>
    setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim()) { setError('กรุณากรอกชื่อสินค้า'); return }
    setSaving(true)
    setError(null)
    try {
      const body = {
        ...form,
        barcode: form.barcode.trim() || undefined,
        quantity: Number(form.quantity),
        costPrice: Number(form.costPrice),
        sellPrice: Number(form.sellPrice),
      }
      const res = await fetch(part ? `/api/parts/${part.id}` : '/api/parts', {
        method: part ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        const msg = typeof json.error === 'string' ? json.error : JSON.stringify(json.error) || 'บันทึกไม่สำเร็จ'
        throw new Error(msg)
      }
      onSaved()
      onClose()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'เกิดข้อผิดพลาด')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-background rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="font-semibold text-lg">{part ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h3>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md px-3 py-2 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">ชื่อสินค้า *</label>
              <input
                autoFocus
                value={form.name}
                onChange={e => set('name', e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="เช่น Intel Core i5-13400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">หมวดหมู่ *</label>
              <select
                value={form.category}
                onChange={e => set('category', e.target.value as Category)}
                className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">แบรนด์</label>
              <input
                value={form.brand}
                onChange={e => set('brand', e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="เช่น Intel, AMD, ASUS"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">รุ่น</label>
              <input
                value={form.model}
                onChange={e => set('model', e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="เช่น i5-13400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">จำนวนในคลัง</label>
              <input
                type="number"
                min={0}
                value={form.quantity}
                onChange={e => set('quantity', e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ราคาทุน (บาท)</label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.costPrice}
                onChange={e => set('costPrice', e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">ราคาขาย (บาท)</label>
              <input
                type="number"
                min={0}
                step={0.01}
                value={form.sellPrice}
                onChange={e => set('sellPrice', e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">บาร์โค้ด</label>
              <input
                value={form.barcode}
                onChange={e => set('barcode', e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="ไม่บังคับ"
              />
            </div>
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md text-sm hover:bg-accent transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {saving ? 'กำลังบันทึก...' : part ? 'บันทึก' : 'เพิ่มสินค้า'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function InventoryPage() {
  const [parts, setParts] = useState<Part[]>([])
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 50, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category | ''>('')
  const [searchInput, setSearchInput] = useState('')
  const [dialog, setDialog] = useState<{ open: boolean; part: Part | null }>({ open: false, part: null })

  const fetchParts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (selectedCategory) params.set('category', selectedCategory)
      params.set('page', String(meta.page))
      params.set('limit', '50')

      const res = await fetch(`/api/parts?${params}`)
      if (!res.ok) throw new Error('Failed to fetch parts')
      const json: PartsResponse = await res.json()
      setParts(json.data)
      setMeta(json.meta)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [search, selectedCategory, meta.page])

  useEffect(() => {
    fetchParts()
  }, [fetchParts])

  const handleSearch = () => {
    setSearch(searchInput)
    setMeta(m => ({ ...m, page: 1 }))
  }

  const handleCategoryChange = (cat: Category | '') => {
    setSelectedCategory(cat)
    setMeta(m => ({ ...m, page: 1 }))
  }

  const handleDelete = async (id: number) => {
    if (!confirm('ลบรายการนี้?')) return
    await fetch(`/api/parts/${id}`, { method: 'DELETE' })
    fetchParts()
  }

  const lowStockCount = parts.filter(p => p.quantity <= 3).length

  return (
    <div className="space-y-4">
      {dialog.open && (
        <PartDialog
          part={dialog.part}
          onClose={() => setDialog({ open: false, part: null })}
          onSaved={fetchParts}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Inventory</h2>
          <p className="text-sm text-muted-foreground">
            {meta.total} รายการ
            {lowStockCount > 0 && (
              <span className="ml-2 text-orange-600 font-medium">· {lowStockCount} ใกล้หมด</span>
            )}
          </p>
        </div>
        <button
          onClick={() => setDialog({ open: true, part: null })}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          เพิ่มสินค้า
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="flex gap-2 flex-1 min-w-64">
          <input
            type="text"
            placeholder="ค้นหาชื่อ, แบรนด์, รุ่น, บาร์โค้ด..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            className="flex-1 px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            onClick={handleSearch}
            className="px-3 py-2 border rounded-md hover:bg-accent transition-colors"
          >
            <Search size={16} />
          </button>
        </div>

        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => handleCategoryChange('')}
            className={cn(
              'px-3 py-1.5 rounded-md text-xs font-medium transition-colors border',
              selectedCategory === '' ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent border-transparent'
            )}
          >
            ทั้งหมด
          </button>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={cn(
                'px-3 py-1.5 rounded-md text-xs font-medium transition-colors border',
                selectedCategory === cat ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent border-transparent'
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={fetchParts}
          className="px-3 py-2 border rounded-md hover:bg-accent transition-colors"
          title="Refresh"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="border rounded-lg overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">ชื่อสินค้า</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">หมวดหมู่</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">แบรนด์</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">คลัง</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">ราคาทุน</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">ราคาขาย</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">กำไร</th>
              <th className="px-4 py-3 font-medium text-muted-foreground w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 8 }).map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-4 bg-muted rounded" />
                    </td>
                  ))}
                </tr>
              ))
            ) : parts.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-muted-foreground">
                  <Package size={32} className="mx-auto mb-2 opacity-30" />
                  ไม่พบรายการสินค้า
                </td>
              </tr>
            ) : (
              parts.map(part => {
                const profit = part.sellPrice - part.costPrice
                const profitPct = part.costPrice > 0 ? (profit / part.costPrice) * 100 : 0
                const isLowStock = part.quantity <= 3

                return (
                  <tr key={part.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium">{part.name}</div>
                      {part.barcode && (
                        <div className="text-xs text-muted-foreground">{part.barcode}</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', CATEGORY_COLORS[part.category as Category])}>
                        {part.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{part.brand}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={cn('font-medium', isLowStock ? 'text-orange-600' : '')}>
                        {part.quantity}
                      </span>
                      {isLowStock && part.quantity === 0 && (
                        <span className="ml-1 text-xs text-red-500">หมด</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right text-muted-foreground">{formatCurrency(part.costPrice)}</td>
                    <td className="px-4 py-3 text-right font-medium">{formatCurrency(part.sellPrice)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className={cn('font-medium', profit >= 0 ? 'text-green-600' : 'text-red-500')}>
                        {formatCurrency(profit)}
                      </div>
                      <div className="text-xs text-muted-foreground">{profitPct.toFixed(1)}%</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 justify-end">
                        <button
                          onClick={() => setDialog({ open: true, part })}
                          className="p-1.5 hover:bg-accent rounded transition-colors text-muted-foreground hover:text-foreground"
                          title="แก้ไข"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(part.id)}
                          className="p-1.5 hover:bg-destructive/10 rounded transition-colors text-muted-foreground hover:text-destructive"
                          title="ลบ"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            หน้า {meta.page} จาก {meta.totalPages} ({meta.total} รายการ)
          </span>
          <div className="flex gap-1">
            <button
              disabled={meta.page <= 1}
              onClick={() => setMeta(m => ({ ...m, page: m.page - 1 }))}
              className="px-3 py-1.5 border rounded-md disabled:opacity-50 hover:bg-accent transition-colors"
            >
              ก่อนหน้า
            </button>
            <button
              disabled={meta.page >= meta.totalPages}
              onClick={() => setMeta(m => ({ ...m, page: m.page + 1 }))}
              className="px-3 py-1.5 border rounded-md disabled:opacity-50 hover:bg-accent transition-colors"
            >
              ถัดไป
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
