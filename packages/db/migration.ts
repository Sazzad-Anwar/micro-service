import { env } from '@repo/env'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

console.log('Migration started')
const migrationClient = postgres(env.DATABASE_URL!, { max: 1 })
await migrate(drizzle(migrationClient), {
  migrationsFolder: './drizzle',
})

await migrationClient.end()
