import { Hono } from 'hono'
import { setCookie, deleteCookie } from 'hono/cookie'
import { sign } from 'jsonwebtoken'
import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'
import { jwtMiddleware } from '../middleware/jwt'
import { generateVerificationToken, hashToken } from '../lib/tokens'
import { sendVerificationLinkEmail, sendPasswordResetEmail } from '../lib/mailer'
import { rateLimit, getIp } from '../lib/rate-limit'

const auth = new Hono()

// --- SIGNUP ---
auth.post('/signup', async (c) => {
  try {
    const ip = getIp(c.req.raw as any) || 'unknown'
    const { success, retryAfter } = rateLimit(`signup:${ip}`, 5, 60000)

    if (!success) {
      return c.json({ error: `Too many requests. Please try again in ${retryAfter} seconds.` }, 429)
    }

    let { email, password, name } = await c.req.json()

    if (!email || !password) {
      return c.json({ error: 'Email and password are required.' }, 400)
    }

    email = email.trim().toLowerCase()

    const existingUser = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } }
    })
    
    if (existingUser) {
      return c.json({ error: 'Email is already in use.' }, 409)
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    const user = await prisma.user.create({
      data: {
        email,
        name: name || email,
        password: hashedPassword,
        emailVerified: null,
      },
    })

    const rawToken = generateVerificationToken()
    const hashedToken = hashToken(rawToken)
    const identifier = `verify:${email}`
    const expires = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.$transaction([
      prisma.verificationToken.deleteMany({ where: { identifier } }),
      prisma.verificationToken.create({
        data: { identifier, token: hashedToken, expires },
      }),
    ])

    await sendVerificationLinkEmail(email, rawToken)

    return c.json({ success: true, message: 'Verification email sent.' }, 201)
  } catch (error) {
    console.error('Signup error:', error)
    return c.json({ error: 'Failed to create account.' }, 500)
  }
})

// --- LOGIN ---
auth.post('/login', async (c) => {
  try {
    const ip = getIp(c.req.raw as any) || 'unknown'
    const { success, retryAfter } = rateLimit(`login:${ip}`, 10, 60000)

    if (!success) {
      return c.json({ error: `Too many requests. Please try again in ${retryAfter} seconds.` }, 429)
    }

    let { email, password } = await c.req.json()

    if (!email || !password) {
      return c.json({ error: 'Email and password are required.' }, 400)
    }

    email = email.trim().toLowerCase()

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } }
    })

    if (!user || !user.password) {
      return c.json({ error: 'Invalid email or password.' }, 401)
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return c.json({ error: 'Invalid email or password.' }, 401)
    }

    if (!user.emailVerified) {
      return c.json({ error: 'Please verify your email before logging in.' }, 403)
    }

    // Generate JWT
    const token = sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET!, { expiresIn: '7d' })
    
    // Set HttpOnly Cookie
    setCookie(c, 'auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return c.json({ success: true, user: { id: user.id, name: user.name, email: user.email } })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: 'Failed to login.' }, 500)
  }
})

// --- LOGOUT ---
auth.post('/logout', async (c) => {
  deleteCookie(c, 'auth_token', { path: '/' })
  return c.json({ success: true, message: 'Logged out successfully.' })
})

// --- ME (Get current user) ---
auth.get('/me', jwtMiddleware, async (c) => {
  const user = c.get('user')
  
  // Optionally fetch fresh user from DB if you want
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, name: true, email: true, image: true, emailVerified: true }
  })

  if (!dbUser) {
    return c.json({ error: 'User not found' }, 404)
  }

  return c.json({ success: true, user: dbUser })
})

// --- VERIFY EMAIL ---
auth.post('/verify-email', async (c) => {
  try {
    const { token, email } = await c.req.json()

    if (!token || !email) {
      return c.json({ error: 'Token and email are required.' }, 400)
    }

    const identifier = `verify:${email}`
    const hashedToken = hashToken(token)

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { identifier_token: { identifier, token: hashedToken } },
    })

    if (!verificationToken) {
      return c.json({ error: 'Invalid verification link. It may have already been used.' }, 400)
    }

    if (new Date() > verificationToken.expires) {
      await prisma.verificationToken.delete({
        where: { identifier_token: { identifier, token: hashedToken } },
      })
      return c.json({ error: 'This verification link has expired. Please request a new one.' }, 400)
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return c.json({ error: 'User not found.' }, 404)
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: { emailVerified: new Date() },
      }),
      prisma.verificationToken.delete({
        where: { identifier_token: { identifier, token: hashedToken } },
      }),
    ])

    // Auto-login upon verification
    const jwtToken = sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET!, { expiresIn: '7d' })
    setCookie(c, 'auth_token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return c.json({ success: true, message: 'Email verified successfully.' })
  } catch (error) {
    console.error('Verification error:', error)
    return c.json({ error: 'An unexpected error occurred during verification.' }, 500)
  }
})

// --- RESEND VERIFICATION ---
auth.post('/resend-verification', async (c) => {
  try {
    const ip = getIp(c.req.raw as any) || 'unknown'
    const { success, retryAfter } = rateLimit(`resend-verification:${ip}`, 3, 60000)

    if (!success) {
      return c.json({ error: `Too many requests. Please try again in ${retryAfter} seconds.` }, 429)
    }

    let { email } = await c.req.json()

    if (!email) {
      return c.json({ error: 'Email is required.' }, 400)
    }

    email = email.trim().toLowerCase()

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } }
    })

    if (!user) {
      return c.json({ success: true, message: 'If an account exists, a verification email has been sent.' })
    }

    if (user.emailVerified) {
      return c.json({ error: 'Email is already verified.' }, 400)
    }

    const rawToken = generateVerificationToken()
    const hashedToken = hashToken(rawToken)
    const identifier = `verify:${email}`
    const expires = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.$transaction([
      prisma.verificationToken.deleteMany({ where: { identifier } }),
      prisma.verificationToken.create({
        data: { identifier, token: hashedToken, expires },
      }),
    ])

    await sendVerificationLinkEmail(email, rawToken)

    return c.json({ success: true, message: 'Verification email resent.' })
  } catch (error) {
    console.error('Resend verification error:', error)
    return c.json({ error: 'Failed to resend verification email.' }, 500)
  }
})

// --- FORGOT PASSWORD ---
auth.post('/forgot-password', async (c) => {
  try {
    const ip = getIp(c.req.raw as any) || 'unknown'
    const { success, retryAfter } = rateLimit(`forgot-password:${ip}`, 3, 60000)

    if (!success) {
      return c.json({ error: `Too many requests. Please try again in ${retryAfter} seconds.` }, 429)
    }

    let { email } = await c.req.json()

    if (!email) {
      return c.json({ error: 'Email is required.' }, 400)
    }

    email = email.trim().toLowerCase()

    const user = await prisma.user.findFirst({
      where: { email: { equals: email, mode: 'insensitive' } }
    })
    
    if (!user) {
      return c.json({ success: true, message: 'If an account exists, a reset email has been sent.' })
    }

    const rawToken = generateVerificationToken()
    const hashedToken = hashToken(rawToken)
    const identifier = `reset:${email}`
    const expires = new Date(Date.now() + 60 * 60 * 1000)

    await prisma.$transaction([
      prisma.verificationToken.deleteMany({ where: { identifier } }),
      prisma.verificationToken.create({
        data: { identifier, token: hashedToken, expires },
      }),
    ])

    await sendPasswordResetEmail(email, rawToken)

    return c.json({ success: true, message: 'Password reset email sent.' })
  } catch (error) {
    console.error('Forgot password error:', error)
    return c.json({ error: 'Failed to send password reset email.' }, 500)
  }
})

export default auth
