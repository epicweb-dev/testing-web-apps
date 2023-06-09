import './setup-env-vars.ts'
import { afterAll, afterEach, beforeAll, expect } from 'vitest'
import { installGlobals } from '@remix-run/node'
import { matchers } from './matchers.cjs'
import 'dotenv/config'
import fsExtra from 'fs-extra'
import { db, prisma } from '~/utils/db.server.ts'
import { execaCommand } from 'execa'
import { deleteAllData } from './utils.ts'

expect.extend(matchers)

installGlobals()

beforeAll(async () => {
	await execaCommand(
		'prisma migrate reset --force --skip-seed --skip-generate',
		{ stdio: 'inherit' },
	)
})

afterEach(() => {
	deleteAllData(db)
})

afterAll(async () => {
	db.close()
	await prisma.$disconnect()
	await fsExtra.remove(process.env.DATABASE_PATH)
})
