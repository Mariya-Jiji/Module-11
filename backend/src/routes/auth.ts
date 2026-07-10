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
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
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
  deleteCookie(c, 'auth_token', { 
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
  })
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
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
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

// --- GOOGLE OAUTH ---
auth.get('/google', (c) => {
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) return c.json({ error: 'Google OAuth not configured' }, 500)
  
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8787'
  const redirectUri = `${backendUrl}/api/auth/google/callback`
  const scope = 'email profile'
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}`
  
  return c.redirect(authUrl)
})

auth.get('/google/callback', async (c) => {
  const code = c.req.query('code')
  const error = c.req.query('error')
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'

  if (error || !code) {
    return c.redirect(`${frontendUrl}/auth/signin?error=OAuthFailed`)
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8787'
  const redirectUri = `${backendUrl}/api/auth/google/callback`

  try {
    // Exchange code for token
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        code,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    })
    
    if (!tokenRes.ok) throw new Error('Failed to get token')
    const tokenData = await tokenRes.json()

    // Get user info
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    })
    
    if (!userRes.ok) throw new Error('Failed to get user info')
    const userData = await userRes.json()

    const email = userData.email.toLowerCase()
    
    let user = await prisma.user.findUnique({ where: { email } })
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: userData.name,
          image: userData.picture,
          emailVerified: new Date(),
        }
      })
    }

    // Set Cookie
    const jwtToken = sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET!, { expiresIn: '7d' })
    setCookie(c, 'auth_token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })

    return c.redirect(`${frontendUrl}/dashboard`)
  } catch (err) {
    console.error('Google OAuth Error:', err)
    return c.redirect(`${frontendUrl}/auth/signin?error=OAuthFailed`)
  }
})

// --- GITHUB OAUTH ---
auth.get('/github', (c) => {
  const clientId = process.env.GITHUB_CLIENT_ID
  if (!clientId) return c.json({ error: 'Github OAuth not configured' }, 500)
  
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8787'
  const redirectUri = `${backendUrl}/api/auth/github/callback`
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email`
  
  return c.redirect(authUrl)
})

auth.get('/github/callback', async (c) => {
  const code = c.req.query('code')
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000'

  if (!code) {
    return c.redirect(`${frontendUrl}/auth/signin?error=OAuthFailed`)
  }

  const clientId = process.env.GITHUB_CLIENT_ID
  const clientSecret = process.env.GITHUB_CLIENT_SECRET
  const backendUrl = process.env.BACKEND_URL || 'http://localhost:8787'
  const redirectUri = `${backendUrl}/api/auth/github/callback`

  try {
    // Exchange code for token
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri
      })
    })
    
    if (!tokenRes.ok) throw new Error('Failed to get github token')
    const tokenData = await tokenRes.json()
    
    if (tokenData.error) throw new Error(tokenData.error)

    // Get user info
    const userRes = await fetch('https://api.github.com/user', {
      headers: { 
        Authorization: `Bearer ${tokenData.access_token}`,
        'User-Agent': 'The-AI-Signal-App'
      }
    })
    
    if (!userRes.ok) throw new Error('Failed to get github user info')
    const userData = await userRes.json()

    // Get user email
    let email = userData.email
    if (!email) {
      const emailRes = await fetch('https://api.github.com/user/emails', {
        headers: { 
          Authorization: `Bearer ${tokenData.access_token}`,
          'User-Agent': 'The-AI-Signal-App'
        }
      })
      const emailsData = await emailRes.json()
      const primaryEmail = emailsData.find((e: any) => e.primary)
      if (primaryEmail) email = primaryEmail.email
    }

    if (!email) throw new Error('No email found in Github account')
    email = email.toLowerCase()

    let user = await prisma.user.findUnique({ where: { email } })
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name: userData.name || userData.login,
          image: userData.avatar_url,
          emailVerified: new Date(),
        }
      })
    }

    // Set Cookie
    const jwtToken = sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET!, { expiresIn: '7d' })
    setCookie(c, 'auth_token', jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7
    })

    return c.redirect(`${frontendUrl}/dashboard`)
  } catch (err) {
    console.error('Github OAuth Error:', err)
    return c.redirect(`${frontendUrl}/auth/signin?error=OAuthFailed`)
  }
})

export default auth
