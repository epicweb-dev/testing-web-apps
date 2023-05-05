import './setup-env-vars'
import { installGlobals } from '@remix-run/node'
import matchers, {
	type TestingLibraryMatchers,
} from '@testing-library/jest-dom/matchers'
import 'dotenv/config'
import fsExtra from 'fs-extra'
import { db } from '~/utils/db.server'
import { BASE_DATABASE_PATH, DATABASE_PATH } from './paths'
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
	await fsExtra.copyFile(BASE_DATABASE_PATH, DATABASE_PATH)
})

afterEach(() => {
	deleteAllData(db)
})

afterAll(async () => {
	await fsExtra.remove(DATABASE_PATH)
})
