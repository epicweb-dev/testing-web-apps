export { readEmail } from '../mocks/utils.ts'

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
