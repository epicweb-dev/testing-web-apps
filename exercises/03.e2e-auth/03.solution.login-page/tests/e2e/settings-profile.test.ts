import { expect, test } from '@playwright/test'
import { parse } from 'cookie'
import { authenticator } from '~/utils/auth.server.ts'
import { commitSession, getSession } from '~/utils/session.server.ts'
import { createContactInfo, createUser } from '../../prisma/seed-utils.ts'
import { insertNewUser } from '../playwright-utils.ts'

test('Users can update their basic info', async ({ page, baseURL }) => {
	const user = await insertNewUser()

	const session = await getSession()
	session.set(authenticator.sessionKey, user.id)
	const cookieValue = await commitSession(session)
	const { _session } = parse(cookieValue)
	page.context().addCookies([
		{
			name: '_session',
			sameSite: 'Lax',
			url: baseURL,
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			value: _session,
		},
	])
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
