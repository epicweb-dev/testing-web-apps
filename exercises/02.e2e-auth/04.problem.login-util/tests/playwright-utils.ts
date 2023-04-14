// 🐨 alias "test" as "base" so we can use it to extend the test object
// and make our own "test" object.
// 🦺 You may as well grab the Page type here too. You'll need it for the
// parameters of your loginPage function.
import { test } from '@playwright/test'
import { z } from 'zod'
import { getPasswordHash } from '~/utils/auth.server'
import { prisma } from '~/utils/db.server'
import { readFixture } from '../mocks/utils'
import { createContactInfo, createUser } from '../prisma/seed-utils'

export const dataCleanup = {
	users: new Set<string>(),
}

const emailSchema = z.object({
	to: z.string(),
	from: z.string(),
	subject: z.string(),
	text: z.string(),
	html: z.string(),
})

export async function readEmail(recipient: string) {
	try {
		const email = await readFixture('email', recipient)
		return emailSchema.parse(email)
	} catch (error) {
		console.error(`Error reading email`, error)
		return null
	}
}

export function deleteUserByUsername(username: string) {
	return prisma.user.delete({ where: { username } })
}

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

// 🐨 export the new test object as "test"
// 🐨 export the expect property from the new test object (as "expect")

// 🐨 export an async function called "loginPage" that takes a page, baseURL,
// and optionally a user and performs the same login steps as before.
// 💰 The user is optional, so if the user is provided, look them up in the
// database instead of creating a new one. Here's how you do that:
// await prisma.user.findUniqueOrThrow({
// 	where: { id: givenUser.id },
// 	select: {
// 		id: true,
// 		email: true,
// 		username: true,
// 		name: true,
// 	},
// })

test.afterEach(async () => {
	if (dataCleanup.users.size > 0) {
		await prisma.user.deleteMany({
			where: { id: { in: [...dataCleanup.users] } },
		})
	}
})
