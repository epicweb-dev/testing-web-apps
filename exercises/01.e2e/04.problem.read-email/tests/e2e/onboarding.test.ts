import { faker } from '@faker-js/faker'
import { expect, test } from '@playwright/test'

// 💰 you're gonna want this:
// const urlRegex = /(?<url>https?:\/\/[^\s$.?#].[^\s]*)/
// function extractUrl(text: string) {
// 	const match = text.match(urlRegex)
// 	return match?.groups?.url
// }

test('onboarding', async ({ page }) => {
	const firstName = faker.name.firstName()
	const lastName = faker.name.lastName()
	const username = faker.internet.userName(firstName, lastName).slice(0, 15)
	const onboardingData = {
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

	await page.getByRole('textbox', { name: /email/i }).fill(onboardingData.email)

	await page.getByRole('button', { name: /launch/i }).click()
	await expect(page.getByText(/check your email/i)).toBeVisible()

	// 🐨 read the email that was sent to the onboardingData.email using the readEmail
	// util you've written.
	// 🐨 verify the email exists
	// 💰 invariant(email, 'Email not found')

	// 🦉 since we're mocking the email service, we need to try and "patch up" the
	// whole we made in reality, so...
	// 🐨 add assertions for the to, from, and subject of the email

	// 🐨 get the URL from the email text using the extractUrl util above.
	// 🐨 verify the URL exists
	// 💰 invariant(onboardingUrl, 'Onboarding URL not found')
	// 🐨 go to the onboarding URL with page.goto

	// 🐨 ensure they are redirected to /onboarding by asserting the page URL is /onboarding

	// 💰 the rest of this is just "use Playwright to fill out the form and submit it."
	// Feel free to write it out if you'd like the practice, but I've got the
	// solution below as well.

	// in addition to filling out and submitting the form, we also want to assert
	// that we can navigate to our profile page and log out. So try doing that too.

	/*



	//    **** 💰 spoiler alert ****



	await page
		.getByRole('textbox', { name: /^username/i })
		.fill(onboardingData.username)

	await page.getByRole('textbox', { name: /^name/i }).fill(onboardingData.name)

	await page.getByLabel(/^password/i).fill(onboardingData.password)

	await page.getByLabel(/^confirm password/i).fill(onboardingData.password)

	await page.getByLabel(/terms/i).check()

	await page.getByLabel(/offers/i).check()

	await page.getByLabel(/remember me/i).check()

	await page.getByRole('button', { name: /Create an account/i }).click()

	await expect(page).toHaveURL(`/`)

	await page.getByRole('link', { name: onboardingData.name }).click()
	await page.getByRole('menuitem', { name: /profile/i }).click()

	await expect(page).toHaveURL(`/users/${onboardingData.username}`)

	await page.getByRole('button', { name: /logout/i }).click()
	await expect(page).toHaveURL(`/`)
	*/
})
