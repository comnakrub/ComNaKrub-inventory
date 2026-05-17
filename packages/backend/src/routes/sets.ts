import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const router = Router()
const prisma = new PrismaClient()

const SetCreateSchema = z.object({
  customerName: z.string().min(1),
  customerPhone: z.string().default(''),
  notes: z.string().default(''),
  items: z.array(z.object({
    partId: z.number().int(),
    quantity: z.number().int().min(1),
    unitPrice: z.number().min(0),
  })),
})

// GET /api/sets
router.get('/', async (_req: Request, res: Response) => {
  try {
    const sets = await prisma.customerSet.findMany({
      include: {
        items: { include: { part: true } },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(sets)
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/sets/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const set = await prisma.customerSet.findUnique({
      where: { id: parseInt(req.params.id, 10) },
      include: {
        items: { include: { part: true } },
        payments: true,
      },
    })
    if (!set) return res.status(404).json({ error: 'Set not found' })
    res.json(set)
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/sets
router.post('/', async (req: Request, res: Response) => {
  try {
    const { customerName, customerPhone, notes, items } = SetCreateSchema.parse(req.body)
    const totalPrice = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)

    const set = await prisma.customerSet.create({
      data: {
        customerName,
        customerPhone,
        notes,
        totalPrice,
        items: {
          create: items,
        },
      },
      include: { items: { include: { part: true } }, payments: true },
    })
    res.status(201).json(set)
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') })
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PATCH /api/sets/:id  (edit items + customer info, adjusts stock if contracted/paid)
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { customerName, customerPhone, notes, items } = z.object({
      customerName: z.string().min(1).optional(),
      customerPhone: z.string().optional(),
      notes: z.string().optional(),
      items: z.array(z.object({
        partId: z.number().int(),
        quantity: z.number().int().min(1),
        unitPrice: z.number().min(0),
      })).optional(),
    }).parse(req.body)

    const id = parseInt(req.params.id, 10)
    const current = await prisma.customerSet.findUnique({
      where: { id },
      include: { items: true },
    })
    if (!current) return res.status(404).json({ error: 'Set not found' })

    const stockAffected = ['contracted', 'paid'].includes(current.status)

    await prisma.$transaction(async (tx) => {
      if (items) {
        // ปรับสต็อกถ้า set มีผลกับคลังแล้ว
        if (stockAffected) {
          for (const old of current.items) {
            await tx.part.update({ where: { id: old.partId }, data: { quantity: { increment: old.quantity } } })
          }
          for (const item of items) {
            await tx.part.update({ where: { id: item.partId }, data: { quantity: { decrement: item.quantity } } })
          }
        }
        await tx.setItem.deleteMany({ where: { setId: id } })
        await tx.setItem.createMany({ data: items.map(i => ({ setId: id, ...i })) })
      }

      const totalPrice = items
        ? items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0)
        : current.totalPrice

      await tx.customerSet.update({
        where: { id },
        data: {
          ...(customerName !== undefined && { customerName }),
          ...(customerPhone !== undefined && { customerPhone }),
          ...(notes !== undefined && { notes }),
          totalPrice,
        },
      })
    })

    const updated = await prisma.customerSet.findUnique({
      where: { id },
      include: { items: { include: { part: true } }, payments: true },
    })
    res.json(updated)
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') })
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PATCH /api/sets/:id/status
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { status } = z.object({
      status: z.enum(['draft', 'deposited', 'contracted', 'paid', 'cancelled']),
    }).parse(req.body)

    const id = parseInt(req.params.id, 10)
    const current = await prisma.customerSet.findUnique({
      where: { id },
      include: { items: true },
    })
    if (!current) return res.status(404).json({ error: 'Set not found' })

    const prev = current.status

    await prisma.$transaction(async (tx) => {
      await tx.customerSet.update({ where: { id }, data: { status } })

      // ตัดสต็อกเมื่อเซ็นสัญญา (เฉพาะครั้งแรก)
      if (status === 'contracted' && prev !== 'contracted' && prev !== 'paid') {
        for (const item of current.items) {
          await tx.part.update({
            where: { id: item.partId },
            data: { quantity: { decrement: item.quantity } },
          })
        }
      }

      // คืนสต็อกเมื่อยกเลิกหลังเซ็นสัญญา/ชำระแล้ว
      if (status === 'cancelled' && (prev === 'contracted' || prev === 'paid')) {
        for (const item of current.items) {
          await tx.part.update({
            where: { id: item.partId },
            data: { quantity: { increment: item.quantity } },
          })
        }
      }
    })

    const updated = await prisma.customerSet.findUnique({ where: { id } })
    res.json(updated)
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') })
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /api/sets/:id
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10)
    const set = await prisma.customerSet.findUnique({
      where: { id },
      include: { items: true },
    })
    if (!set) return res.status(404).json({ error: 'Set not found' })

    await prisma.$transaction(async (tx) => {
      if (set.status === 'contracted' || set.status === 'paid') {
        for (const item of set.items) {
          await tx.part.update({
            where: { id: item.partId },
            data: { quantity: { increment: item.quantity } },
          })
        }
      }
      await tx.customerSet.delete({ where: { id } })
    })

    res.status(204).end()
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/sets/:id/payments
router.post('/:id/payments', async (req: Request, res: Response) => {
  try {
    const { amount, method, note } = z.object({
      amount: z.number().min(0),
      method: z.string().default('cash'),
      note: z.string().default(''),
    }).parse(req.body)

    const payment = await prisma.payment.create({
      data: { setId: parseInt(req.params.id, 10), amount, method, note },
    })
    res.status(201).json(payment)
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') })
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
