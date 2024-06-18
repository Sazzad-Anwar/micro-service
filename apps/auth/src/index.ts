import { env } from '@repo/env'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { secureHeaders } from 'hono/secure-headers'
import registration from './routes/registration'
import user from './routes/user'

const app = new Hono().basePath('/api/v1/auth')

app.use(cors())
app.use(secureHeaders())
app.use(logger())
app.use(prettyJSON())
app.get('/', (ctx) => {
  return ctx.json({
    data: {
      name: 'Authentication module',
      status: 'ok',
    },
    message: 'Authentication module is running',
  })
})
app.route('/registration', registration)
app.use(jwt({ secret: env.JWT_SECRET })).route('/user', user)

export default {
  port: 3001,
  fetch: app.fetch,
}
