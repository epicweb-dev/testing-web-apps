import { expect, test } from '@playwright/test'
// 🐨 you're gonna need these imports:
// import { parse } from 'cookie'
// import { authenticator } from '~/utils/auth.server'
// import { commitSession, getSession } from '~/utils/session.server'
import { createContactInfo, createUser } from '../../prisma/seed-utils'
// import { insertNewUser } from '../playwright-utils'

// 🐨 get the baseURL from the callback argument (like we do with the page)
test('Users can update their basic info', async ({ page }) => {
	// 🐨 insert a user with the insertNewUser utility

	// 🐨 Programmatically create a session for the user and get a cookie value
	// to insert into the page.
	// 💰 You're not expected to know how to do this for this app, so here's
	// how that's done:
	// const session = await getSession()
	// session.set(authenticator.sessionKey, user.id)
	// const cookieValue = await commitSession(session)
	// const { _session } = parse(cookieValue)

	// 🐨 get the page context and add a cookie to it using the baseURL with
	// similar cookie configuration as found in '~/utils/session.server'
	// 💰 the name of the cookie is "_session"
	// 💰 the sameSite is "Lax" instead of "lax"
	// 💰 the url option should be baseURL
	// 💰 importantly, the value should be the _session value variable from above
	// 💰 there's no "secrets" config option necessary here

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
