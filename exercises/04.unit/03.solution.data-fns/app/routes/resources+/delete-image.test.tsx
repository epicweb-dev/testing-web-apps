/**
 * @vitest-environment node
 */
import fs from 'fs'
import { createPassword, createUser } from 'prisma/seed-utils'
import { BASE_URL, getUserSetCookieHeader } from 'tests/vitest-utils'
import invariant from 'tiny-invariant'
import { expect, test } from 'vitest'
import { prisma } from '~/utils/db.server'
import { ROUTE_PATH, action } from './delete-image'

const RESOURCE_URL = `${BASE_URL}${ROUTE_PATH}`

test('allows users to delete their own images', async () => {
	const userData = createUser()
	const user = await prisma.user.create({
		data: {
			...userData,
			password: {
				create: createPassword(userData.username),
			},
			image: {
				create: {
					contentType: 'image/jpeg',
					file: {
						create: {
							blob: await fs.promises.readFile(
								'./tests/fixtures/test-profile.jpg',
							),
						},
					},
				},
			},
		},
		select: { id: true, imageId: true },
	})
	invariant(user.imageId, 'User should have an image')
	const cookie = await getUserSetCookieHeader(user)
	const form = new FormData()
	form.set('imageId', user.imageId)
	const request = new Request(RESOURCE_URL, {
		method: 'POST',
		headers: { cookie },
		body: form,
	})

	const response = await action({ request, params: {}, context: {} })
	expect(await response.json()).toEqual({ status: 'success' })
	const deletedImage = await prisma.image.findUnique({
		where: { fileId: user.imageId },
	})

	expect(deletedImage, 'Image should be deleted').toBeNull()
})
