import { expect, test } from '@playwright/test'
import { createContactInfo, createUser } from '../../prisma/seed-utils'

// 🐨 get the baseURL from the callback argument (like we do with the page)
test('Users can update their basic info', async ({ page }) => {
	// 🐨 insert a user with the insertNewUser utility
	// 🐨 create a cookie value using the following steps:
	// 1. create a new session using the getSession utility from '~/utils/session.server'
	// 2. set the user.id in the session using the authenticator.sessionKey (from '~/utils/auth.server')
	// 3. commit the session using the commitSession utility from '~/utils/session.server'
	// 4. parse the cookie value returned from commitSession using the parse function from the 'cookie' package
	// 5. get the _session value from the parsed cookie value

	// 🐨 get the page context and add a cookie to it using the baseURL with
	// similar cookie configuration as found in '~/utils/session.server'
	// 💰 importantly, the value should be the _session value from step 5

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
