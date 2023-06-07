import { getPasswordHash } from '~/utils/auth.server.ts'
import { prisma } from '~/utils/db.server.ts'
import { createContactInfo, createUser } from '../prisma/seed-utils.ts'

// 🐨 export a dataCleanup object with a users property that is a Set<string>

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
	// 🐨 add the user.id to the dataCleanup.users Set
	return user
}

// 🐨 add a test.afterEach callback that deletes all the users in the dataCleanup.users Set
// 💰 this isn't a prisma workshop, so if you want help with the prisma bit, check out below...

/*


// **** 💰 spoiler alert ****


if (dataCleanup.users.size > 0) {
		await prisma.user.deleteMany({
			where: { id: { in: [...dataCleanup.users] } },
		})
	}
*/
