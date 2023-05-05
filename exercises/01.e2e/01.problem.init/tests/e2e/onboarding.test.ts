import { test } from '@playwright/test'

test('onboarding', async ({ page }) => {
	// 🐨 go to the homepage (💰 "/")
	// 🐨 click the element with the role "link" and the name "Log in"
	// 🐨 assert that the URL is now "/login"
	// 🐨 click the element with the role "link" and the name "Create an account"
	// 🐨 assert that the URL is now "/signup"
	// 💰 you'll need to import "expect" from '@playwright/test'
	// 🐨 fill in the textbox with the name "email" with a fake email using faker
	// 💰 you'll need to import "faker" from '@faker-js/faker'
	// 💰 faker.internet.email()
})
