import path from 'path'

// You'll move the calculation of these paths to a new file called ./paths.ts
// so it can be used in multiple places.
// 🐨 assign these environment variables to the values you export from ./paths.ts
const databaseFile = `./prisma/test/data.db`
process.env.DATABASE_PATH = path.join(process.cwd(), databaseFile)
process.env.DATABASE_URL = `file:${process.env.DATABASE_PATH}?connection_limit=1`
