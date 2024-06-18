import { env } from '@repo/env'
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema/schema'
const queryClient = postgres(env.DATABASE_URL)
export const db = drizzle(queryClient, { schema })
export * from './schema/users.schema'
