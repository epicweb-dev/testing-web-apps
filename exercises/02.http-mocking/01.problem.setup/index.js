require('dotenv/config')

// 🐨 require the ./mocks module if process.env.MOCKS === 'true'

if (process.env.NODE_ENV === 'production') {
	require('./server-build')
} else {
	require('./server')
}
