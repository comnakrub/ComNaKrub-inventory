import { useState, useEffect, useCallback } from 'react'
import { Plus, X, Search, Trash2, ChevronRight } from 'lucide-react'
import { Part } from '@/types/part'
import { cn, formatCurrency } from '@/lib/utils'

type SetStatus = 'draft' | 'deposited' | 'contracted' | 'paid' | 'cancelled'

interface SetItem {
  id: number
  partId: number
  quantity: number
  unitPrice: number
  part: Part
}

interface Payment {
  id: number
  amount: number
  method: string
  note: string
  paidAt: string
}

interface CustomerSet {
  id: number
  customerName: string
  customerPhone: string
  notes: string
  totalPrice: number
  status: SetStatus
  createdAt: string
  items: SetItem[]
  payments: Payment[]
}

const STATUS_LABELS: Record<SetStatus, string> = {
  draft: 'แบบร่าง',
  deposited: 'มัดจำแล้ว',
  contracted: 'เซ็นสัญญาแล้ว',
  paid: 'ชำระแล้ว',
  cancelled: 'ยกเลิก',
}

const STATUS_COLORS: Record<SetStatus, string> = {
  draft: 'bg-gray-100 text-gray-700',
  deposited: 'bg-yellow-100 text-yellow-700',
  contracted: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
}

// ---- Create Set Dialog ----
interface DraftItem {
  partId: number
  quantity: number
  unitPrice: number
  part: Part
}

function CreateSetDialog({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [notes, setNotes] = useState('')
  const [items, setItems] = useState<DraftItem[]>([])
  const [partSearch, setPartSearch] = useState('')
  const [searchResults, setSearchResults] = useState<Part[]>([])
  const [searching, setSearching] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchParts = useCallback(async (query: string) => {
    if (!query.trim()) { setSearchResults([]); return }
    setSearching(true)
    try {
      const params = new URLSearchParams({ limit: '20' })
      if (query.trim()) params.set('search', query)
      const res = await fetch(`/api/parts?${params}`)
      const json = await res.json()
      setSearchResults(json.data ?? [])
    } finally {
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => searchParts(partSearch), 300)
    return () => clearTimeout(t)
  }, [partSearch, searchParts])

  const addPart = (part: Part) => {
    setItems(prev => {
      const existing = prev.find(i => i.partId === part.id)
      if (existing) return prev.map(i => i.partId === part.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { partId: part.id, quantity: 1, unitPrice: part.costPrice, part }]
    })
    setPartSearch('')
    setSearchResults([])
  }

  const removeItem = (partId: number) => setItems(prev => prev.filter(i => i.partId !== partId))

  const updateItem = (partId: number, field: 'quantity' | 'unitPrice', value: number) =>
    setItems(prev => prev.map(i => i.partId === partId ? { ...i, [field]: value } : i))

  const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerName.trim()) { setError('กรุณากรอกชื่อลูกค้า'); return }
    if (items.length === 0) { setError('กรุณาเพิ่มสินค้าอย่างน้อย 1 รายการ'); return }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/sets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          customerPhone,
          notes,
          items: items.map(i => ({ partId: i.partId, quantity: i.quantity, unitPrice: i.unitPrice })),
        }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(typeof json.error === 'string' ? json.error : 'บันทึกไม่สำเร็จ')
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
        className="bg-background rounded-lg shadow-xl flex flex-col"
        style={{ resize: 'both', overflow: 'hidden', width: 700, minWidth: 480, maxWidth: '92vw', minHeight: 420, maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <h3 className="font-semibold text-lg">สร้างชุดคอมใหม่</h3>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded transition-colors"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-5 flex-1 overflow-y-auto">
          {error && (
            <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded-md px-3 py-2 text-sm">{error}</div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">ชื่อลูกค้า *</label>
              <input autoFocus value={customerName} onChange={e => setCustomerName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="ชื่อ-นามสกุล" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">เบอร์โทร</label>
              <input value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="08x-xxx-xxxx" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">หมายเหตุ</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
                className="w-full px-3 py-2 border rounded-md text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                placeholder="รายละเอียดเพิ่มเติม" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">เพิ่มสินค้า</label>
            <div className="relative">
              <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-background">
                <Search size={14} className="text-muted-foreground shrink-0" />
                <input value={partSearch} onChange={e => setPartSearch(e.target.value)}
                  className="flex-1 text-sm bg-transparent outline-none"
                  placeholder="ค้นหาชื่อสินค้า, แบรนด์, รุ่น..." />
              </div>
              {(searchResults.length > 0 || (searching && partSearch)) && (
                <div className="absolute top-full left-0 right-0 z-20 bg-background border rounded-md shadow-lg mt-1 max-h-48 overflow-y-auto">
                  {searching && <div className="px-3 py-2 text-sm text-muted-foreground">กำลังค้นหา...</div>}
                  {searchResults.map(part => (
                    <button key={part.id} type="button" onClick={() => addPart(part)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent transition-colors flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <span className="font-medium">{part.name}</span>
                        {part.brand && <span className="text-muted-foreground ml-1">{part.brand}</span>}
                      </div>
                      <span className="text-muted-foreground shrink-0">{formatCurrency(part.costPrice)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {items.length > 0 && (
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium text-muted-foreground">สินค้า</th>
                    <th className="text-center px-3 py-2 font-medium text-muted-foreground w-20">จำนวน</th>
                    <th className="text-right px-3 py-2 font-medium text-muted-foreground w-28">ราคา/ชิ้น</th>
                    <th className="text-right px-3 py-2 font-medium text-muted-foreground w-24">รวม</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {items.map(item => (
                    <tr key={item.partId}>
                      <td className="px-3 py-2">
                        <div className="font-medium">{item.part.name}</div>
                        {item.part.brand && <div className="text-xs text-muted-foreground">{item.part.brand}</div>}
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" min={1} value={item.quantity}
                          onChange={e => updateItem(item.partId, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full text-center px-1 py-1 border rounded text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary/50" />
                      </td>
                      <td className="px-3 py-2">
                        <input type="number" min={0} step={0.01} value={item.unitPrice}
                          onChange={e => updateItem(item.partId, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full text-right px-1 py-1 border rounded text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary/50" />
                      </td>
                      <td className="px-3 py-2 text-right font-medium">{formatCurrency(item.unitPrice * item.quantity)}</td>
                      <td className="px-3 py-2">
                        <button type="button" onClick={() => removeItem(item.partId)}
                          className="p-1 hover:text-destructive transition-colors text-muted-foreground">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t bg-muted/30">
                  <tr>
                    <td colSpan={3} className="px-3 py-2 text-right font-semibold">รวมทั้งหมด</td>
                    <td className="px-3 py-2 text-right font-bold text-primary">{formatCurrency(total)}</td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={onClose}
              className="px-4 py-2 border rounded-md text-sm hover:bg-accent transition-colors">ยกเลิก</button>
            <button type="submit" disabled={saving}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50">
              {saving ? 'กำลังบันทึก...' : 'สร้างชุด'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ---- Set Detail Dialog ----
function SetDetailDialog({ set, onClose, onUpdated }: { set: CustomerSet; onClose: () => void; onUpdated: () => void }) {
  // view state
  const [addingPayment, setAddingPayment] = useState(false)
  const [payAmount, setPayAmount] = useState('')
  const [payMethod, setPayMethod] = useState('cash')
  const [payNote, setPayNote] = useState('')
  const [saving, setSaving] = useState(false)

  const [deleting, setDeleting] = useState(false)

  // edit state
  const [editing, setEditing] = useState(false)
  const [draftName, setDraftName] = useState(set.customerName)
  const [draftPhone, setDraftPhone] = useState(set.customerPhone)
  const [draftNotes, setDraftNotes] = useState(set.notes)
  const [draftItems, setDraftItems] = useState<DraftItem[]>(
    set.items.map(i => ({ partId: i.partId, quantity: i.quantity, unitPrice: i.unitPrice, part: i.part }))
  )
  const [partSearch, setPartSearch] = useState('')
  const [searchResults, setSearchResults] = useState<Part[]>([])
  const [searching, setSearching] = useState(false)
  const [savingEdit, setSavingEdit] = useState(false)
  const [editError, setEditError] = useState<string | null>(null)

  const searchParts = useCallback(async (query: string) => {
    if (!query.trim()) { setSearchResults([]); return }
    setSearching(true)
    try {
      const params = new URLSearchParams({ limit: '20' })
      if (query.trim()) params.set('search', query)
      const res = await fetch(`/api/parts?${params}`)
      const json = await res.json()
      setSearchResults(json.data ?? [])
    } finally {
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(() => searchParts(partSearch), 300)
    return () => clearTimeout(t)
  }, [partSearch, searchParts])

  const addDraftPart = (part: Part) => {
    setDraftItems(prev => {
      const existing = prev.find(i => i.partId === part.id)
      if (existing) return prev.map(i => i.partId === part.id ? { ...i, quantity: i.quantity + 1 } : i)
      return [...prev, { partId: part.id, quantity: 1, unitPrice: part.costPrice, part }]
    })
    setPartSearch(''); setSearchResults([])
  }

  const removeDraftItem = (partId: number) => setDraftItems(prev => prev.filter(i => i.partId !== partId))

  const updateDraftItem = (partId: number, field: 'quantity' | 'unitPrice', value: number) =>
    setDraftItems(prev => prev.map(i => i.partId === partId ? { ...i, [field]: value } : i))

  const draftTotal = draftItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)

  const handleSaveEdit = async () => {
    if (!draftName.trim()) { setEditError('กรุณากรอกชื่อลูกค้า'); return }
    if (draftItems.length === 0) { setEditError('กรุณาเพิ่มสินค้าอย่างน้อย 1 รายการ'); return }
    setSavingEdit(true); setEditError(null)
    try {
      const res = await fetch(`/api/sets/${set.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: draftName,
          customerPhone: draftPhone,
          notes: draftNotes,
          items: draftItems.map(i => ({ partId: i.partId, quantity: i.quantity, unitPrice: i.unitPrice })),
        }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        throw new Error(typeof json.error === 'string' ? json.error : 'บันทึกไม่สำเร็จ')
      }
      onUpdated(); onClose()
    } catch (e) {
      setEditError(e instanceof Error ? e.message : 'เกิดข้อผิดพลาด')
    } finally {
      setSavingEdit(false)
    }
  }

  const totalPaid = set.payments.reduce((sum, p) => sum + p.amount, 0)
  const remaining = set.totalPrice - totalPaid

  const handleDelete = async () => {
    const isStockAffected = set.status === 'contracted' || set.status === 'paid'
    const msg = isStockAffected
      ? 'ลบชุดนี้? ระบบจะคืนจำนวนสินค้ากลับคลังโดยอัตโนมัติ ยืนยัน?'
      : 'ลบชุดนี้? การกระทำนี้ไม่สามารถย้อนกลับได้'
    if (!confirm(msg)) return
    setDeleting(true)
    try {
      await fetch(`/api/sets/${set.id}`, { method: 'DELETE' })
      onUpdated()
      onClose()
    } finally {
      setDeleting(false)
    }
  }

  const handleStatusChange = async (status: SetStatus) => {
    await fetch(`/api/sets/${set.id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    onUpdated()
    onClose()
  }

  const handleAddPayment = async () => {
    const amount = parseFloat(payAmount)
    if (!amount || amount <= 0) return
    setSaving(true)
    try {
      await fetch(`/api/sets/${set.id}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, method: payMethod, note: payNote }),
      })
      onUpdated()
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-background rounded-lg shadow-xl flex flex-col"
        style={{ resize: 'both', overflow: 'hidden', width: 600, minWidth: 420, maxWidth: '92vw', minHeight: 360, maxHeight: '92vh' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b shrink-0">
          <div>
            <h3 className="font-semibold text-lg">{editing ? 'แก้ไขชุด' : set.customerName}</h3>
            {!editing && set.customerPhone && <p className="text-sm text-muted-foreground">{set.customerPhone}</p>}
          </div>
          <div className="flex items-center gap-2">
            {!editing && (
              <span className={cn('px-2.5 py-1 rounded-full text-xs font-medium', STATUS_COLORS[set.status])}>
                {STATUS_LABELS[set.status]}
              </span>
            )}
            {!editing && set.status !== 'cancelled' && (
              <button onClick={() => setEditing(true)}
                className="px-2.5 py-1 border rounded text-xs hover:bg-accent transition-colors">
                แก้ไข
              </button>
            )}
            {!editing && (
              <button onClick={handleDelete} disabled={deleting}
                className="px-2.5 py-1 border border-destructive text-destructive rounded text-xs hover:bg-destructive/10 transition-colors disabled:opacity-50">
                {deleting ? '...' : 'ลบ'}
              </button>
            )}
            <button onClick={onClose} className="p-1 hover:bg-accent rounded transition-colors"><X size={18} /></button>
          </div>
        </div>

        {/* ---- EDIT MODE ---- */}
        {editing ? (
          <div className="px-6 py-4 space-y-4 flex-1 overflow-y-auto">
            {(set.status === 'contracted' || set.status === 'paid') && (
              <div className="bg-orange-50 border border-orange-200 text-orange-800 rounded px-3 py-2 text-sm">
                ชุดนี้เซ็นสัญญา/ชำระแล้ว — การแก้ไขจะปรับจำนวนสินค้าในคลังอัตโนมัติ
              </div>
            )}
            {editError && (
              <div className="bg-destructive/10 text-destructive border border-destructive/20 rounded px-3 py-2 text-sm">{editError}</div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">ชื่อลูกค้า *</label>
                <input value={draftName} onChange={e => setDraftName(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary/50" />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">เบอร์โทร</label>
                <input value={draftPhone} onChange={e => setDraftPhone(e.target.value)}
                  className="w-full px-3 py-1.5 border rounded text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary/50" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-medium mb-1">หมายเหตุ</label>
                <textarea value={draftNotes} onChange={e => setDraftNotes(e.target.value)} rows={2}
                  className="w-full px-3 py-1.5 border rounded text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none" />
              </div>
            </div>

            {/* Category filter */}
            <div>
              <label className="block text-xs font-medium mb-1">เพิ่มสินค้า</label>
              <div className="relative">
                <div className="flex items-center gap-2 px-3 py-2 border rounded-md bg-background">
                  <Search size={13} className="text-muted-foreground shrink-0" />
                  <input value={partSearch} onChange={e => setPartSearch(e.target.value)}
                    className="flex-1 text-sm bg-transparent outline-none"
                    placeholder="ค้นหาสินค้า..." />
                </div>
                {(searchResults.length > 0 || (searching && partSearch)) && (
                  <div className="absolute top-full left-0 right-0 z-20 bg-background border rounded-md shadow-lg mt-1 max-h-40 overflow-y-auto">
                    {searching && <div className="px-3 py-2 text-sm text-muted-foreground">กำลังค้นหา...</div>}
                    {searchResults.map(part => (
                      <button key={part.id} type="button" onClick={() => addDraftPart(part)}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent flex items-center justify-between gap-2">
                        <span><span className="font-medium">{part.name}</span>{part.brand && <span className="text-muted-foreground ml-1">{part.brand}</span>}</span>
                        <span className="text-muted-foreground shrink-0">{formatCurrency(part.costPrice)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Draft items table */}
            {draftItems.length > 0 && (
              <div className="border rounded-md overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 border-b">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium text-muted-foreground">สินค้า</th>
                      <th className="text-center px-3 py-2 font-medium text-muted-foreground w-20">จำนวน</th>
                      <th className="text-right px-3 py-2 font-medium text-muted-foreground w-28">ราคา/ชิ้น</th>
                      <th className="text-right px-3 py-2 font-medium text-muted-foreground w-24">รวม</th>
                      <th className="w-8" />
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {draftItems.map(item => (
                      <tr key={item.partId}>
                        <td className="px-3 py-2">
                          <div className="font-medium">{item.part.name}</div>
                          {item.part.brand && <div className="text-xs text-muted-foreground">{item.part.brand}</div>}
                        </td>
                        <td className="px-3 py-2">
                          <input type="number" min={1} value={item.quantity}
                            onChange={e => updateDraftItem(item.partId, 'quantity', Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-full text-center px-1 py-1 border rounded text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary/50" />
                        </td>
                        <td className="px-3 py-2">
                          <input type="number" min={0} step={0.01} value={item.unitPrice}
                            onChange={e => updateDraftItem(item.partId, 'unitPrice', parseFloat(e.target.value) || 0)}
                            className="w-full text-right px-1 py-1 border rounded text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary/50" />
                        </td>
                        <td className="px-3 py-2 text-right font-medium">{formatCurrency(item.unitPrice * item.quantity)}</td>
                        <td className="px-3 py-2">
                          <button type="button" onClick={() => removeDraftItem(item.partId)}
                            className="p-1 hover:text-destructive transition-colors text-muted-foreground">
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="border-t bg-muted/30">
                    <tr>
                      <td colSpan={3} className="px-3 py-2 text-right font-semibold">รวมทั้งหมด</td>
                      <td className="px-3 py-2 text-right font-bold text-primary">{formatCurrency(draftTotal)}</td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}

            <div className="flex gap-2 justify-end pt-2">
              <button type="button" onClick={() => { setEditing(false); setEditError(null) }}
                className="px-4 py-2 border rounded-md text-sm hover:bg-accent transition-colors">ยกเลิก</button>
              <button type="button" onClick={handleSaveEdit} disabled={savingEdit}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:opacity-90 disabled:opacity-50">
                {savingEdit ? 'กำลังบันทึก...' : 'บันทึก'}
              </button>
            </div>
          </div>
        ) : (

        /* ---- VIEW MODE ---- */
        <div className="px-6 py-4 space-y-5 flex-1 overflow-y-auto">
          {set.notes && (
            <p className="text-sm text-muted-foreground bg-muted/50 rounded px-3 py-2">{set.notes}</p>
          )}

          {/* Items */}
          <div>
            <h4 className="text-sm font-semibold mb-2">รายการสินค้า</h4>
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium text-muted-foreground">สินค้า</th>
                    <th className="text-center px-3 py-2 font-medium text-muted-foreground">จำนวน</th>
                    <th className="text-right px-3 py-2 font-medium text-muted-foreground">ราคา</th>
                    <th className="text-right px-3 py-2 font-medium text-muted-foreground">รวม</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {set.items.map(item => (
                    <tr key={item.id}>
                      <td className="px-3 py-2">
                        <div className="font-medium">{item.part.name}</div>
                        {item.part.brand && <div className="text-xs text-muted-foreground">{item.part.brand}</div>}
                      </td>
                      <td className="px-3 py-2 text-center">{item.quantity}</td>
                      <td className="px-3 py-2 text-right">{formatCurrency(item.unitPrice)}</td>
                      <td className="px-3 py-2 text-right font-medium">{formatCurrency(item.unitPrice * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t bg-muted/30">
                  <tr>
                    <td colSpan={3} className="px-3 py-2 text-right font-semibold">รวม</td>
                    <td className="px-3 py-2 text-right font-bold">{formatCurrency(set.totalPrice)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Payments */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold">การชำระเงิน</h4>
              {set.status !== 'cancelled' && set.status !== 'paid' && (
                <button onClick={() => setAddingPayment(v => !v)}
                  className="text-xs px-2 py-1 border rounded hover:bg-accent transition-colors flex items-center gap-1">
                  <Plus size={12} /> เพิ่มการชำระ
                </button>
              )}
            </div>

            {set.payments.length > 0 ? (
              <div className="space-y-1 mb-2">
                {set.payments.map(p => (
                  <div key={p.id} className="flex items-center justify-between text-sm px-3 py-2 bg-muted/30 rounded">
                    <div>
                      <span className="font-medium">{p.method === 'cash' ? 'เงินสด' : 'โอน'}</span>
                      {p.note && <span className="text-muted-foreground ml-2">{p.note}</span>}
                    </div>
                    <span className="font-medium text-green-600">{formatCurrency(p.amount)}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between text-sm px-3 py-1.5 font-semibold">
                  <span>ชำระแล้ว</span>
                  <span className="text-green-600">{formatCurrency(totalPaid)}</span>
                </div>
                {remaining > 0 && (
                  <div className="flex items-center justify-between text-sm px-3 py-1.5 font-semibold text-orange-600">
                    <span>ค้างชำระ</span>
                    <span>{formatCurrency(remaining)}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground mb-2">ยังไม่มีการชำระเงิน</p>
            )}

            {addingPayment && (
              <div className="border rounded-md p-3 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1">จำนวนเงิน (บาท)</label>
                    <input type="number" min={0} step={0.01}
                      value={payAmount} onChange={e => setPayAmount(e.target.value)}
                      placeholder={remaining > 0 ? String(remaining) : '0'}
                      className="w-full px-3 py-1.5 border rounded text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">วิธีชำระ</label>
                    <select value={payMethod} onChange={e => setPayMethod(e.target.value)}
                      className="w-full px-3 py-1.5 border rounded text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary/50">
                      <option value="cash">เงินสด</option>
                      <option value="transfer">โอน</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium mb-1">หมายเหตุ</label>
                    <input value={payNote} onChange={e => setPayNote(e.target.value)}
                      className="w-full px-3 py-1.5 border rounded text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary/50"
                      placeholder="ไม่บังคับ" />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setAddingPayment(false)}
                    className="px-3 py-1.5 border rounded text-sm hover:bg-accent">ยกเลิก</button>
                  <button type="button" onClick={handleAddPayment} disabled={saving}
                    className="px-3 py-1.5 bg-primary text-primary-foreground rounded text-sm hover:opacity-90 disabled:opacity-50">
                    {saving ? 'กำลังบันทึก...' : 'บันทึก'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Status actions */}
          {set.status !== 'paid' && set.status !== 'cancelled' && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {set.status === 'draft' && (
                <button onClick={() => handleStatusChange('deposited')}
                  className="px-3 py-1.5 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600 transition-colors">
                  มัดจำแล้ว
                </button>
              )}
              {(set.status === 'draft' || set.status === 'deposited') && (
                <button onClick={() => {
                  if (!confirm('เซ็นสัญญาแล้ว — ระบบจะตัดจำนวนสินค้าออกจากคลังทันที ยืนยัน?')) return
                  handleStatusChange('contracted')
                }}
                  className="px-3 py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors">
                  เซ็นสัญญาแล้ว
                </button>
              )}
              <button onClick={() => handleStatusChange('paid')}
                className="px-3 py-1.5 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors">
                ชำระเสร็จแล้ว
              </button>
              <button onClick={() => handleStatusChange('cancelled')}
                className="px-3 py-1.5 border border-destructive text-destructive rounded text-sm hover:bg-destructive/10 transition-colors ml-auto">
                ยกเลิกชุด
              </button>
            </div>
          )}
        </div>
        )} {/* end editing ternary */}
      </div>
    </div>
  )
}

// ---- Main Page ----
const ALL_STATUSES: SetStatus[] = ['draft', 'deposited', 'contracted', 'paid', 'cancelled']

export default function CustomerSetsPage() {
  const [sets, setSets] = useState<CustomerSet[]>([])
  const [loading, setLoading] = useState(true)
  const [createOpen, setCreateOpen] = useState(false)
  const [selectedSet, setSelectedSet] = useState<CustomerSet | null>(null)
  const [filterStatus, setFilterStatus] = useState<SetStatus | ''>('')

  const fetchSets = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/sets')
      const data = await res.json()
      setSets(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchSets() }, [fetchSets])

  const filtered = filterStatus ? sets.filter(s => s.status === filterStatus) : sets

  return (
    <div className="space-y-4">
      {createOpen && <CreateSetDialog onClose={() => setCreateOpen(false)} onSaved={fetchSets} />}
      {selectedSet && <SetDetailDialog set={selectedSet} onClose={() => setSelectedSet(null)} onUpdated={fetchSets} />}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Customer Sets</h2>
          <p className="text-sm text-muted-foreground">{sets.length} ชุดทั้งหมด</p>
        </div>
        <button onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity">
          <Plus size={16} />
          สร้างชุดใหม่
        </button>
      </div>

      <div className="flex gap-1 flex-wrap">
        <button onClick={() => setFilterStatus('')}
          className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-colors border',
            filterStatus === '' ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent border-transparent')}>
          ทั้งหมด
        </button>
        {ALL_STATUSES.map(s => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-colors border',
              filterStatus === s ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent border-transparent')}>
            {STATUS_LABELS[s]}
          </button>
        ))}
      </div>

      <div className="border rounded-lg overflow-hidden bg-card">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">ลูกค้า</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">รายการ</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">ยอดรวม</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">สถานะ</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">วันที่</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  {Array.from({ length: 6 }).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 bg-muted rounded" /></td>
                  ))}
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">ไม่พบรายการ</td>
              </tr>
            ) : (
              filtered.map(set => (
                <tr key={set.id} onClick={() => setSelectedSet(set)}
                  className="hover:bg-muted/30 transition-colors cursor-pointer">
                  <td className="px-4 py-3">
                    <div className="font-medium">{set.customerName}</div>
                    {set.customerPhone && <div className="text-xs text-muted-foreground">{set.customerPhone}</div>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{set.items.length} รายการ</td>
                  <td className="px-4 py-3 text-right font-medium">{formatCurrency(set.totalPrice)}</td>
                  <td className="px-4 py-3">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', STATUS_COLORS[set.status])}>
                      {STATUS_LABELS[set.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {new Date(set.createdAt).toLocaleDateString('th-TH')}
                  </td>
                  <td className="px-4 py-3"><ChevronRight size={14} className="text-muted-foreground" /></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
