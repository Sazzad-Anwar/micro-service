import { env } from '@repo/env'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { jwt } from 'hono/jwt'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { secureHeaders } from 'hono/secure-headers'
import login from './routes/login'
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
app.route('/login', login)
app.use(jwt({ secret: env.JWT_SECRET })).route('/user', user)
app.use(async (ctx) => {
  return ctx.json({
    data: null,
    message: `${ctx.req.method}:${ctx.req.url} not found`,
  })
})

export default {
  port: 3001,
  fetch: app.fetch,
}
