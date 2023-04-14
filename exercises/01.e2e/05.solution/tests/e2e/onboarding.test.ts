import { faker } from '@faker-js/faker'
import { expect, test } from '@playwright/test'
import invariant from 'tiny-invariant'
import { deleteUserByUsername, readEmail } from '../playwright-utils'

const urlRegex = /(?<url>https?:\/\/[^\s$.?#].[^\s]*)/
function extractUrl(text: string) {
	const match = text.match(urlRegex)
	return match?.groups?.url
}

test('onboarding', async ({ page }) => {
	const firstName = faker.name.firstName()
	const lastName = faker.name.lastName()
	const username = faker.internet.userName(firstName, lastName).slice(0, 15)
	const loginForm = {
		name: `${firstName} ${lastName}`,
		username,
		email: `${username}@example.com`,
		password: faker.internet.password(),
	}

	await page.goto('/')

	await page.getByRole('link', { name: /log in/i }).click()
	await expect(page).toHaveURL(`/login`)

	const createAccountLink = page.getByRole('link', {
		name: /create an account/i,
	})
	await createAccountLink.click()

	await expect(page).toHaveURL(`/signup`)

	await page.getByRole('textbox', { name: /email/i }).fill(loginForm.email)

	await page.getByRole('button', { name: /launch/i }).click()
	await expect(page.getByText(/check your email/i)).toBeVisible()

	const email = await readEmail(loginForm.email)
	invariant(email, 'Email not found')
	expect(email.to).toBe(loginForm.email)
	expect(email.from).toBe('hello@rocketrental.space')
	expect(email.subject).toMatch(/welcome/i)
	const onboardingUrl = extractUrl(email.text)
	invariant(onboardingUrl, 'Onboarding URL not found')
	await page.goto(onboardingUrl)

	await expect(page).toHaveURL(`/onboarding`)
	await page
		.getByRole('textbox', { name: /^username/i })
		.fill(loginForm.username)

	await page.getByRole('textbox', { name: /^name/i }).fill(loginForm.name)

	await page.getByLabel(/^password/i).fill(loginForm.password)

	await page.getByLabel(/^confirm password/i).fill(loginForm.password)

	await page.getByLabel(/terms/i).check()

	await page.getByLabel(/offers/i).check()

	await page.getByLabel(/remember me/i).check()

	await page.getByRole('button', { name: /Create an account/i }).click()

	await expect(page).toHaveURL(`/`)

	await page.getByRole('link', { name: loginForm.name }).click()
	await page.getByRole('menuitem', { name: /profile/i }).click()

	await expect(page).toHaveURL(`/users/${loginForm.username}`)

	await page.getByRole('button', { name: /logout/i }).click()
	await expect(page).toHaveURL(`/`)

	await deleteUserByUsername(loginForm.username)
})
