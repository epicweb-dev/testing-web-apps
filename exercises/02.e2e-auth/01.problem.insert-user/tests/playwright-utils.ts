import { z } from 'zod'
import { prisma } from '~/utils/db.server'
import { readFixture } from '../mocks/utils'

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

// 🐨 export an async function called insertNewUser that takes an optional
// password (if none is provided, just use the username as the password).
//   💰 This isn't a prisma workshop, so if you want a *strong* hint, check below...
//   🐨 create a user using the createUser function from '../prisma/seed-utils'
//   🐨 create a contactInfo using the createContactInfo function from '../prisma/seed-utils'
//   🐨 create a user in the database using prisma.user.create
//   💰 to create the password hash, use getPasswordHash from '~/utils/auth.server'
//   🐨 return the user

// 💰 here's the code to create the user in the database:
/*

// *** spoiler warning ***

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
*/