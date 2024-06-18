export const env = {
  JWT_SECRET:
    '418a7fc1cb5de682b53cf2fc47bff15b6ed58e132792ee17199ef9fef19288b7',
  DATABASE_URL: 'postgres://sazzad:sazzad14@localhost:5432/drizzleDB',
  JWT_EXPIRES_IN: Math.floor(Date.now() / 1000) + 60 * 1,
}
