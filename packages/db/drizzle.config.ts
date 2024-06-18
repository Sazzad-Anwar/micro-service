import { env } from '@repo/env'
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './schema/*',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL!,
  },
})
