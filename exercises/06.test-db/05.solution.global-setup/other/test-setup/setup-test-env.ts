import './setup-env-vars.ts'
import { afterAll, afterEach, beforeAll, expect } from 'vitest'
import { installGlobals } from '@remix-run/node'
import { matchers } from './matchers.cjs'
import 'dotenv/config'
import fsExtra from 'fs-extra'
import { db, prisma } from '~/utils/db.server.ts'
import { BASE_DATABASE_PATH, DATABASE_PATH } from './paths.ts'
import { deleteAllData } from './utils.ts'

expect.extend(matchers)

installGlobals()

beforeAll(async () => {
	await fsExtra.copyFile(BASE_DATABASE_PATH, DATABASE_PATH)
})

afterEach(() => {
	deleteAllData(db)
})

afterAll(async () => {
	db.close()
	await prisma.$disconnect()
	await fsExtra.remove(DATABASE_PATH)
})
