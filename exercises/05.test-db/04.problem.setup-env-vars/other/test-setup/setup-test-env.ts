// 🐨 add the import to the new ./setup-env-vars.ts file
// 🦉 It's important that it shows up first so it's evaluated
// before any other modules we import
import { installGlobals } from '@remix-run/node'
import matchers, {
	type TestingLibraryMatchers,
} from '@testing-library/jest-dom/matchers'
import 'dotenv/config'
import fsExtra from 'fs-extra'
import path from 'path'
// 🐨 import the db from the utils/db.server.ts file here
// instead of using a dynamic import below
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

// 🐨 move this to the setup-env-vars.ts file
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
	// 💣 remove this dynamic import
	const { db } = await import('~/utils/db.server')
	deleteAllData(db)
})

afterAll(async () => {
	await fsExtra.remove(process.env.DATABASE_PATH)
})
