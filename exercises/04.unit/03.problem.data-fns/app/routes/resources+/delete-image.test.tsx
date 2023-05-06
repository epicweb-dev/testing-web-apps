/**
 * @vitest-environment node
 */
// 🐨 you're going to need all these imports:
// import fs from 'fs'
// import { createPassword, createUser } from 'prisma/seed-utils'
// import { BASE_URL, getUserSetCookieHeader } from 'tests/vitest-utils'
// import invariant from 'tiny-invariant'
// import { expect, test } from 'vitest'
// import { prisma } from '~/utils/db.server'
// import { ROUTE_PATH, action } from './delete-image'

// 🐨 create a RESOURCE_URL variable here that concatenates the BASE_URL with
// the ROUTE_PATH

test('allows users to delete their own images', async () => {
	// 💰 this isn't a prisma workshop, so I'm going to give you the user:
	// const userData = createUser()
	// const user = await prisma.user.create({
	// 	data: {
	// 		...userData,
	// 		password: {
	// 			create: createPassword(userData.username),
	// 		},
	// 		image: {
	// 			create: {
	// 				contentType: 'image/jpeg',
	// 				file: {
	// 					create: {
	// 						blob: await fs.promises.readFile(
	// 							'./tests/fixtures/test-profile.jpg',
	// 						),
	// 					},
	// 				},
	// 			},
	// 		},
	// 	},
	// 	select: { id: true, imageId: true },
	// })
	// invariant(user.imageId, 'User should have an image')
	// 🐨 create a cookie header for the user with getUserSetCookieHeader
	//
	// 🐨 create a FormData object (https://mdn.io/formdata)
	//
	// 🐨 set the form's imageId value to the user.imageId
	//
	// 🐨 create a new Request object (https://mdn.io/request)
	// 💰 the first argument is the RESOURCE_URL and the second argument is an
	// object with a method ('POST'), headers (with the cookie header), and body
	// which is the form you created above.
	//
	// 🐨 call the action function with the request, params ({}), and context ({})
	//
	// 🐨 assert that the response.json() resolves to an object equal to { status: 'success' }
	//
	// Now we need to assert that the image was deleted from the database
	// 💰 here's how you look for the image:
	// const deletedImage = await prisma.image.findUnique({
	// 	where: { fileId: user.imageId },
	// })
	//
	// 🐨 assert that the deletedImage is null
})
