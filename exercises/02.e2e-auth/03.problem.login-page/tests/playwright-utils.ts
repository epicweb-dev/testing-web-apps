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

test.afterEach(async () => {
	if (dataCleanup.users.size > 0) {
		await prisma.user.deleteMany({
			where: { id: { in: [...dataCleanup.users] } },
		})
	}
})
