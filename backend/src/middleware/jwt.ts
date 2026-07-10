import { Context, Next } from 'hono'
import { getCookie } from 'hono/cookie'
import { verify } from 'jsonwebtoken'

export const jwtMiddleware = async (c: Context, next: Next) => {
  const token = getCookie(c, 'auth_token')
  
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!)
    c.set('user', decoded)
    await next()
  } catch (error) {
    return c.json({ error: 'Invalid or expired token' }, 401)
  }
}
