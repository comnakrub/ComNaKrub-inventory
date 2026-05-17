import express from 'express'
import cors from 'cors'
import partsRouter from './routes/parts'
import setsRouter from './routes/sets'

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/parts', partsRouter)
app.use('/api/sets', setsRouter)

export default app
