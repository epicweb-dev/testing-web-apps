import { test } from '@playwright/test'
import { getPasswordHash } from '~/utils/auth.server'
import { prisma } from '~/utils/db.server'
import { createContactInfo, createUser } from '../prisma/seed-utils'

export const dataCleanup = {
	users: new Set<string>(),
}

export { readEmail } from '../mocks/utils'

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
