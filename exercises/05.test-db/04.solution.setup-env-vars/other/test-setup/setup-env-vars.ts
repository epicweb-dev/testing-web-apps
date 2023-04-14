import path from 'path'

const databaseFile = `./prisma/test/data.${process.env.VITEST_POOL_ID || 0}.db`
export const DATABASE_PATH = path.join(process.cwd(), databaseFile)
export const DATABASE_URL = `file:${DATABASE_PATH}?connection_limit=1`

process.env.DATABASE_PATH = DATABASE_PATH
process.env.DATABASE_URL = DATABASE_URL
