import { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import { z } from 'zod'

const router = Router()
const prisma = new PrismaClient()

const PartCreateSchema = z.object({
  name: z.string().min(1),
  brand: z.string().default(''),
  model: z.string().default(''),
  quantity: z.number().int().min(0).default(0),
  costPrice: z.number().min(0).default(0),
  sellPrice: z.number().min(0).default(0),
  barcode: z.string().optional(),
  imageUrl: z.string().optional(),
})

const PartUpdateSchema = PartCreateSchema.partial()

// GET /api/parts
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, page = '1', limit = '50' } = req.query

    const where: Record<string, unknown> = { isActive: true }

    if (search && typeof search === 'string') {
      where.OR = [
        { name: { contains: search } },
        { brand: { contains: search } },
        { model: { contains: search } },
        { barcode: { contains: search } },
      ]
    }

    const pageNum = parseInt(page as string, 10)
    const limitNum = parseInt(limit as string, 10)
    const skip = (pageNum - 1) * limitNum

    const [parts, total] = await Promise.all([
      prisma.part.findMany({
        where,
        orderBy: { name: 'asc' },
        skip,
        take: limitNum,
      }),
      prisma.part.count({ where }),
    ])

    res.json({
      data: parts,
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    })
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/parts/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const part = await prisma.part.findUnique({
      where: { id: parseInt(req.params.id, 10) },
    })
    if (!part) return res.status(404).json({ error: 'Part not found' })
    res.json(part)
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/parts
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = PartCreateSchema.parse(req.body)
    const part = await prisma.part.create({ data })
    res.status(201).json(part)
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') })
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PATCH /api/parts/:id
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const data = PartUpdateSchema.parse(req.body)
    const part = await prisma.part.update({
      where: { id: parseInt(req.params.id, 10) },
      data,
    })
    res.json(part)
  } catch (err) {
    if (err instanceof z.ZodError) return res.status(400).json({ error: err.errors.map(e => e.message).join(', ') })
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /api/parts/:id  (soft delete)
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    await prisma.part.update({
      where: { id: parseInt(req.params.id, 10) },
      data: { isActive: false },
    })
    res.status(204).send()
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/parts/:id/restore (recover soft deleted item)
router.post('/:id/restore', async (req: Request, res: Response) => {
  try {
    const part = await prisma.part.update({
      where: { id: parseInt(req.params.id, 10) },
      data: { isActive: true },
    })
    res.json(part)
  } catch {
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
