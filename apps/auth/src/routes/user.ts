import { db, users } from '@repo/db'
import { eq } from 'drizzle-orm'
import { Hono } from 'hono'

const user = new Hono()

user.get('/', async (c) => {
  const payload = c.get('jwtPayload') as any
  const user = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
    })
    .from(users)
    .where(eq(users.email, payload.email))
  return c.json({
    data: user[0],
  })
})

export default user
