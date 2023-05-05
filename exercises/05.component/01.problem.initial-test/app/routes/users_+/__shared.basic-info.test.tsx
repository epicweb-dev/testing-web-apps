import { test } from 'vitest'

test('Link to chat is a form if user is logged in, is not self, and no chat exists yet', async () => {
	// 🐨 create a user object with an imageId, username, and name
	// 💰 you can use faker for this from '@faker-js/faker' to generate random data
	//
	// 🐨 create a remix stub with a route for /users/:username/host
	// and an element that renders the UserProfileBasicInfo component
	// with appropriate props
	//
	// 🐨 create a routeUrl for the initialEntries prop of the remix stub
	//
	// 🐨 render the remix stub with the routeUrl as the initialEntries
	//
	// 🐨 get the startChatButton by role and name
	// 💰 if you're not sure how, you can use one of these handy utilities:
	// screen.debug() logs the DOM as HTML
	// logRoles(document.body) (from @testing-library/react) logs elements with roles and their names
	// screen.logTestingPlaygroundURL() logs a URL you can use to see the DOM in the browser
	//
	// 🐨 assert that the startChatButton has the correct title
	//
	// 🦺 help TypeScript know what the "startChatButton" type is by using
	// invariant from 'tiny-invariant' to assert that it's an HTMLButtonElement
	//
	// 🐨 assert that the startChatButton's form has the correct action (it should be the routeUrl) and method (it should be a post)
})
