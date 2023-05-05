import { installGlobals } from '@remix-run/node'
import matchers, {
	type TestingLibraryMatchers,
} from '@testing-library/jest-dom/matchers'
import 'dotenv/config'

declare global {
	namespace Vi {
		interface JestAssertion<T = any>
			extends jest.Matchers<void, T>,
				TestingLibraryMatchers<T, void> {}
	}
}

expect.extend(matchers)

installGlobals()
