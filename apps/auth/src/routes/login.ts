import { zValidator } from '@hono/zod-validator'
import { db, users } from '@repo/db'
import { env } from '@repo/env'
import { LoginSchema } from '@repo/zod-schema'
import { compare } from 'bcrypt'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'
import { sign } from 'hono/jwt'

const login = new Hono()
login.post('/', zValidator('json', LoginSchema), async (ctx) => {
  let payload = await ctx.req.json()
  const user = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      password: users.password,
    })
    .from(users)
    .where(eq(users.email, payload.email))
  if (user.length) {
    const isMatched = await compare(payload.password, user[0].password!)
    if (!isMatched) {
      ctx.status(401)
      return ctx.json({
        user: null,
        message: 'Invalid credentials',
      })
    } else {
      const token = await sign(
        { ...payload, exp: env.JWT_EXPIRES_IN },
        env.JWT_SECRET,
      )
      setCookie(ctx, 'token', `Bearer ${token}`, {
        path: '/',
        secure: true,
        // domain: 'example.com',
        httpOnly: true,
        maxAge: 1000,
        expires: new Date(env.JWT_EXPIRES_IN),
        sameSite: 'Strict',
      })
      return ctx.json({
        data: {
          token,
        },
      })
    }
  } else {
    ctx.status(404)
    return ctx.json({
      user: null,
      message: 'User is not registered',
    })
  }
})

export default login
