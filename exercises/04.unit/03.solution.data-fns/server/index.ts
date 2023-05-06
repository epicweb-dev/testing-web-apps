import path from 'path'
import express from 'express'
import compression from 'compression'
import morgan from 'morgan'
import address from 'address'
import closeWithGrace from 'close-with-grace'
import { createRequestHandler } from '@remix-run/express'
import { type ServerBuild } from '@remix-run/node'

const BUILD_DIR = path.join(process.cwd(), 'build')

async function start() {
	const { default: getPort, portNumbers } = await import('get-port')
	const { default: chalk } = await import('chalk')
	const app = express()

	app.use(compression())

	// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
	app.disable('x-powered-by')

	// Remix fingerprints its assets so we can cache forever.
	app.use(
		'/build',
		express.static('public/build', { immutable: true, maxAge: '1y' }),
	)

	// Everything else (like favicon.ico) is cached for an hour. You may want to be
	// more aggressive with this caching.
	app.use(express.static('public', { maxAge: '1h' }))

	app.use(morgan('tiny'))

	app.all(
		'*',
		process.env.NODE_ENV === 'development'
			? async (req, res, next) => {
					purgeRequireCache()

					try {
						const build = await getBuild()

						return createRequestHandler({
							build,
							mode: process.env.NODE_ENV,
						})(req, res, next)
					} catch (error: unknown) {
						const message =
							error && typeof error === 'object' && 'message' in error
								? error.message
								: String(error)
						return res.status(500).send(message)
					}
			  }
			: createRequestHandler({
					build: require(BUILD_DIR),
					mode: process.env.NODE_ENV,
			  }),
	)

	const desiredPort = Number(process.env.PORT || 3000)
	const portToUse = await getPort({
		port: portNumbers(desiredPort, desiredPort + 100),
	})

	const server = app.listen(portToUse, () => {
		const addy = server.address()
		const portUsed =
			desiredPort === portToUse
				? desiredPort
				: addy && typeof addy === 'object'
				? addy.port
				: 0

		if (portUsed !== desiredPort) {
			console.warn(
				chalk.yellow(
					`⚠️  Port ${desiredPort} is not available, using ${portUsed} instead.`,
				),
			)
		}
		console.log(`🚀  We have liftoff!`)
		const localUrl = `http://localhost:${portUsed}`
		let lanUrl: string | null = null
		const localIp = address.ip()
		// Check if the address is a private ip
		// https://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces
		// https://github.com/facebook/create-react-app/blob/d960b9e38c062584ff6cfb1a70e1512509a966e7/packages/react-dev-utils/WebpackDevServerUtils.js#LL48C9-L54C10
		if (/^10[.]|^172[.](1[6-9]|2[0-9]|3[0-1])[.]|^192[.]168[.]/.test(localIp)) {
			lanUrl = `http://${localIp}:${portUsed}`
		}

		console.log(
			`
${chalk.bold('Local:')}            ${chalk.cyan(localUrl)}
${lanUrl ? `${chalk.bold('On Your Network:')}  ${chalk.cyan(lanUrl)}` : ''}
${chalk.bold('Press Ctrl+C to stop')}
	`.trim(),
		)
	})

	closeWithGrace(async () => {
		await new Promise((resolve, reject) => {
			server.close(e => (e ? reject(e) : resolve('ok')))
		})
	})
}

start()

function purgeRequireCache() {
	// purge require cache on requests for "server side HMR" this won't let
	// you have in-memory objects between requests in development,
	// alternatively you can set up nodemon/pm2-dev to restart the server on
	// file changes, but then you'll have to reconnect to databases/etc on each
	// change. We prefer the DX of this, so we've included it for you by default
	for (const key in require.cache) {
		if (key.startsWith(BUILD_DIR)) {
			delete require.cache[key]
		}
	}
}

// wait for the build directory to exist before trying to require it
// this is necessary because the build directory is created by the
// build process, which is started by the dev process
async function getBuild(): Promise<ServerBuild> {
	let start = Date.now()
	while (Date.now() - start < 10000) {
		try {
			return require(BUILD_DIR)
		} catch (error: unknown) {
			if (
				error &&
				typeof error === 'object' &&
				'code' in error &&
				error.code !== 'MODULE_NOT_FOUND'
			) {
				throw error
			}
		}
		await new Promise(resolve => setTimeout(resolve, 100))
	}
	throw new Error(`Could not find build directory at ${BUILD_DIR}`)
}
