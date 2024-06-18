import { zValidator } from '@hono/zod-validator'
import { db, users } from '@repo/db'
import { env } from '@repo/env'
import { RegistrationSchema } from '@repo/zod-schema'
import { Hono } from 'hono'
import { sign } from 'hono/jwt'

const registration = new Hono()

registration.post('/', zValidator('json', RegistrationSchema), async (ctx) => {
  const payload = await ctx.req.json()
  await db.insert(users).values(payload)
  const token = await sign(
    { ...payload, exp: env.JWT_EXPIRES_IN },
    env.JWT_SECRET,
  )
  return ctx.json({
    token,
  })
})

export default registration
