import { zValidator } from '@hono/zod-validator'
import { db, users } from '@repo/db'
import { env } from '@repo/env'
import { RegistrationSchema } from '@repo/zod-schema'
import { genSalt, hash } from 'bcrypt'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'
import { sign } from 'hono/jwt'

const registration = new Hono()
registration.post('/', zValidator('json', RegistrationSchema), async (ctx) => {
  try {
    let payload = await ctx.req.json()

    const user = await db
      .select({
        id: users.id,
        email: users.email,
      })
      .from(users)
      .where(eq(users.email, payload.email))
    if (user.length) {
      ctx.status(409)
      return ctx.json({
        data: null,
        message: 'User already exists',
      })
    } else {
      payload.password = await hash(payload.password, await genSalt(10))
      payload.refreshToken = crypto.randomUUID()
      await db.insert(users).values(payload)
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
        token,
      })
    }
  } catch (error) {
    ctx.status(500)
    return ctx.json({
      data: null,
      message: 'Internal Server Error',
      error: error,
    })
  }
})

export default registration
