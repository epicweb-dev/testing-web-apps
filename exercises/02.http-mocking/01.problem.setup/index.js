import 'dotenv/config'

// 🐨 import the ./mocks module if process.env.MOCKS === 'true'

if (process.env.NODE_ENV === 'production') {
	await import('./server-build/index.js')
} else {
	await import('./server/index.ts')
}
