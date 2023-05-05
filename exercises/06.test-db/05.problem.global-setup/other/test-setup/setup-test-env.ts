import './setup-env-vars'
import { installGlobals } from '@remix-run/node'
import matchers, {
	type TestingLibraryMatchers,
} from '@testing-library/jest-dom/matchers'
import 'dotenv/config'
import fsExtra from 'fs-extra'
import { db } from '~/utils/db.server'
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

beforeAll(async () => {
	// 🐨 move this logic to ./gobal-setup.ts and instead copy the base database
	// to the test database here (using exports from ./paths.ts)
	// 💰 await fsExtra.copyFile(BASE_DATABASE_PATH, DATABASE_PATH)
	await execaCommand(
		'prisma migrate reset --force --skip-seed --skip-generate',
		{ stdio: 'inherit' },
	)
})

afterEach(() => {
	deleteAllData(db)
})

afterAll(async () => {
	// 🐨 if you want, you can use the `DATABASE_PATH` export from ./paths.ts here
	// instead of the environment variable. They should be the same though, so no biggy.
	await fsExtra.remove(process.env.DATABASE_PATH)
})
