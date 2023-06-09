// 🐨 alias "test" as "base" so we can use it to extend the test object
// and make our own "test" object.
import { test, type Page } from '@playwright/test'
import { parse } from 'cookie'
import { authenticator, getPasswordHash } from '~/utils/auth.server.ts'
import { prisma } from '~/utils/db.server.ts'
import { commitSession, getSession } from '~/utils/session.server.ts'
import { createContactInfo, createUser } from '../prisma/seed-utils.ts'

export const dataCleanup = {
	users: new Set<string>(),
}

export { readEmail } from '../mocks/utils.ts'

export async function insertNewUser({ password }: { password?: string } = {}) {
	const userData = createUser()
	const user = await prisma.user.create({
		data: {
			...userData,
			contactInfo: {
				create: createContactInfo(),
			},
			password: {
				create: {
					hash: await getPasswordHash(password || userData.username),
				},
			},
		},
		select: { id: true, name: true, username: true, email: true },
	})
	dataCleanup.users.add(user.id)
	return user
}

// 🐨 create a new test object that extends the base test object
// with a util called "login" which is a short function that calls
// the loginPage function and returns the result.
// 💰 Base what you're doing here on the example in the instructions.
// 🦺 your type for the login function is:
// login: (user?: { id: string }) => ReturnType<typeof loginPage>
// 🐨 You're going to need the page and baseURL from the test context which you
// will foward to the loginPage function.

// 🐨 export the new test object as "test"
// 🐨 export the expect property from the new test object (as "expect")
// you'll need to use these instead of the ones from '@playwright/test'
// from now on if you want to be able to use the login function.

export async function loginPage({
	page,
	baseURL,
	user: givenUser,
}: {
	page: Page
	baseURL: string | undefined
	user?: { id: string }
}) {
	const user = givenUser
		? await prisma.user.findUniqueOrThrow({
				where: { id: givenUser.id },
				select: {
					id: true,
					email: true,
					username: true,
					name: true,
				},
		  })
		: await insertNewUser()

	const session = await getSession()
	session.set(authenticator.sessionKey, user.id)
	const cookieValue = await commitSession(session)
	const { _session } = parse(cookieValue)
	page.context().addCookies([
		{
			name: '_session',
			sameSite: 'Lax',
			url: baseURL,
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			value: _session,
		},
	])
	return user
}

test.afterEach(async () => {
	if (dataCleanup.users.size > 0) {
		await prisma.user.deleteMany({
			where: { id: { in: [...dataCleanup.users] } },
		})
	}
})
