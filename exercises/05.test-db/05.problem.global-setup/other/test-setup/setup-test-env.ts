import { installGlobals } from '@remix-run/node'
import matchers, {
	type TestingLibraryMatchers,
} from '@testing-library/jest-dom/matchers'
import 'dotenv/config'
import fsExtra from 'fs-extra'
import path from 'path'
import { execaCommand } from 'execa'
import { deleteAllData } from './utils'

declare global {
	namespace Vi {
		interface JestAssertion<T = any>
			extends jest.Matchers<void, T>,
				TestingLibraryMatchers<T, void> {}
	}
}

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
	const { db } = await import('~/utils/db.server')
	deleteAllData(db)
})

afterAll(async () => {
	await fsExtra.remove(process.env.DATABASE_PATH)
})
