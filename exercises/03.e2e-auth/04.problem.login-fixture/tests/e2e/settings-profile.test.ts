import { faker } from '@faker-js/faker'
// 🐨 swap the expect and test here for the ones from playwright-utils
import { expect, test } from '@playwright/test'
import invariant from 'tiny-invariant'
import { verifyLogin } from '~/utils/auth.server.ts'
import { createContactInfo, createUser } from '../../prisma/seed-utils.ts'
import { insertNewUser, loginPage } from '../playwright-utils.ts'

// 🐨 access the login utility just like you do the page in this params list:
// 💰 you're not going to need the baseURL here anymore.
test('Users can update their basic info', async ({ page, baseURL }) => {
	// 🐨 swap loginPage for the login utility:
	// 💰 await login()
	await loginPage({ page, baseURL })

	await page.goto('/settings/profile')

	const newUserData = createUser()
	const newUserContactInfo = createContactInfo()

	await page.getByRole('textbox', { name: /^name/i }).fill(newUserData.name)
	await page
		.getByRole('textbox', { name: /^username/i })
		.fill(newUserData.username)

	await page
		.getByRole('textbox', { name: /^phone/i })
		.fill(newUserContactInfo.phone)
	await page
		.getByRole('textbox', { name: /^address/i })
		.fill(newUserContactInfo.address)
	await page
		.getByRole('textbox', { name: /^city/i })
		.fill(newUserContactInfo.city)
	await page
		.getByRole('textbox', { name: /^state/i })
		.fill(newUserContactInfo.state)
	await page
		.getByRole('textbox', { name: /^zip/i })
		.fill(newUserContactInfo.zip)
	await page
		.getByRole('textbox', { name: /^country/i })
		.fill(newUserContactInfo.country)

	await page.getByRole('button', { name: /^save/i }).click()

	await expect(page).toHaveURL(`/users/${newUserData.username}`)
})

test('Users can update their password', async ({ page }) => {
	const oldPassword = faker.internet.password()
	const newPassword = faker.internet.password()
	const user = await insertNewUser({ password: oldPassword })
	// 🐨 call the login utility here with the user we created above
	await page.goto('/settings/profile')

	const fieldset = page.getByRole('group', { name: /change password/i })

	await fieldset
		.getByRole('textbox', { name: /^current password/i })
		.fill(oldPassword)
	await fieldset
		.getByRole('textbox', { name: /^new password/i })
		.fill(newPassword)

	await page.getByRole('button', { name: /^save/i }).click()

	await expect(page).toHaveURL(`/users/${user.username}`)

	expect(
		await verifyLogin(user.username, oldPassword),
		'Old password still works',
	).toEqual(null)
	expect(
		await verifyLogin(user.username, newPassword),
		'New password does not work',
	).toEqual({ id: user.id })
})

test('Users can become a host', async ({ page }) => {
	// 🐨 call the login utility here and use the returned user instead of this fake one
	const user = {
		id: faker.datatype.uuid(),
		username: faker.internet.userName(),
	}
	await page.goto('/settings/profile')

	await page.getByRole('button', { name: /become a host/i }).click()

	const hostBio = faker.lorem.sentences(2)
	const hostBioLocator = page.getByRole('textbox', { name: /host bio/i })
	await expect(hostBioLocator).toBeFocused()
	await hostBioLocator.fill(hostBio)

	await page.getByRole('button', { name: /^save/i }).click()

	await expect(page, 'Was not redirected to the /host profile').toHaveURL(
		`/users/${user.username}/host`,
	)
	await expect(page.getByText(hostBio)).toBeVisible()
})

test('Users can become a renter', async ({ page }) => {
	// 🐨 call the login utility here and use the returned user instead of this fake one
	const user = {
		id: faker.datatype.uuid(),
		username: faker.internet.userName(),
	}
	await page.goto('/settings/profile')

	await page.getByRole('button', { name: /become a renter/i }).click()

	const renterBio = faker.lorem.sentences(2)
	const renterBioLocator = page.getByRole('textbox', { name: /renter bio/i })
	await expect(renterBioLocator).toBeFocused()
	await renterBioLocator.fill(renterBio)

	await page.getByRole('button', { name: /^save/i }).click()

	await expect(page, 'Was not redirected to the /renter profile').toHaveURL(
		`/users/${user.username}/renter`,
	)
	await expect(page.getByText(renterBio)).toBeVisible()
})

test('Users can update their profile photo', async ({ page }) => {
	// 🐨 call the login utility here and use the returned user instead of this fake one
	const user = {
		id: faker.datatype.uuid(),
		username: faker.internet.userName(),
		name: faker.person.fullName(),
	}
	await page.goto('/settings/profile')

	invariant(user.name, 'User must have a name to test profile photo')

	const beforeSrc = await page.getByAltText(user.name).getAttribute('src')

	await page.getByRole('link', { name: /change profile photo/i }).click()

	await expect(page).toHaveURL(`/settings/profile/photo`)

	await page
		.getByRole('dialog', { name: /profile photo/i })
		.getByLabel(/change/i)
		.setInputFiles('./tests/fixtures/test-profile.jpg')

	await page
		.getByRole('dialog', { name: /profile photo/i })
		.getByRole('button', { name: /save/i })
		.click()

	await expect(
		page,
		'Was not redirected after saving the profile photo',
	).toHaveURL(`/settings/profile`)

	const afterSrc = await page.getByAltText(user.name).getAttribute('src')

	expect(beforeSrc).not.toEqual(afterSrc)
})
