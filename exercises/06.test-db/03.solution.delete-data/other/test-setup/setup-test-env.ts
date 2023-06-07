import { afterAll, afterEach, beforeAll, expect } from 'vitest'
import { installGlobals } from '@remix-run/node'
import { matchers } from './matchers.cjs'
import 'dotenv/config'
import fsExtra from 'fs-extra'
import path from 'path'
import { execaCommand } from 'execa'
import { deleteAllData } from './utils.ts'

expect.extend(matchers)

installGlobals()

const databaseFile = `./prisma/test/data.db`
process.env.DATABASE_PATH = path.join(process.cwd(), databaseFile)
process.env.DATABASE_URL = `file:${process.env.DATABASE_PATH}?connection_limit=1`

beforeAll(async () => {
	await execaCommand(
		'prisma migrate reset --force --skip-seed --skip-generate',
		{ stdio: 'inherit' },
	)
})

afterEach(async () => {
	const { db } = await import('~/utils/db.server.ts')
	deleteAllData(db)
})

afterAll(async () => {
	const { db, prisma } = await import('~/utils/db.server.ts')
	db.close()
	await prisma.$disconnect()
	await fsExtra.remove(process.env.DATABASE_PATH)
})
