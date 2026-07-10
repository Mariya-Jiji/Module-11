import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import dotenv from 'dotenv'
import authRoute from './routes/auth'

dotenv.config()

const app = new Hono()

// Enable CORS for frontend
app.use('*', cors({
  origin: 'http://localhost:3000',
  credentials: true,
}))

app.get('/', (c) => c.text('API is running'))

// Mount auth routes under /api/auth
app.route('/api/auth', authRoute)

const port = 8787
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
