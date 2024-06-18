import type { Context, Next } from 'hono'

export const authorization = (ctx: Context, next: Next) => {
  const token = ctx.req.header().authorization
  if (token) {
    return next()
  } else {
    ctx.status(401)
    return ctx.json({
      message: 'Unauthorized',
    })
  }
}
