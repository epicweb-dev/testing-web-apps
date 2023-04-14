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
	await execaCommand(
		'prisma migrate reset --force --skip-seed --skip-generate',
		{ stdio: 'inherit' },
	)
})

afterEach(() => {
	deleteAllData(db)
})

afterAll(async () => {
	await fsExtra.remove(process.env.DATABASE_PATH)
})
