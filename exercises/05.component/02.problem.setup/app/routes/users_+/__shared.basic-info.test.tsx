import { expect, test } from 'vitest'
import { faker } from '@faker-js/faker'
import { render, screen } from '@testing-library/react'
import { unstable_createRemixStub as createRemixStub } from '@remix-run/testing'
import { UserProfileBasicInfo } from './__shared.tsx'
import invariant from 'tiny-invariant'

// 🐨 create a setup function does everything that's common between all the tests

test('Link to chat is a form if user is logged in, is not self, and no chat exists yet', async () => {
	// 🐨 call setup here and delete the stuff setup handles
	const user = {
		imageId: faker.string.uuid(),
		username: faker.internet.userName(),
		name: faker.person.fullName(),
	}
	const App = createRemixStub([
		{
			path: '/users/:username/host',
			element: (
				<UserProfileBasicInfo
					user={user}
					rating={null}
					userJoinedDisplay={new Date().toLocaleDateString()}
					userLoggedIn={true}
					isSelf={false}
					oneOnOneChatId={null}
					stats={[]}
					bio={null}
				/>
			),
		},
	])

	const routeUrl = `/users/${user.username}/host`
	render(<App initialEntries={[routeUrl]} />)

	const startChatButton = await screen.findByRole('button', {
		name: /message/i,
	})
	expect(startChatButton).toHaveAttribute('title', 'Start new chat')
	invariant(
		startChatButton instanceof HTMLButtonElement,
		'startChatButton is not a button',
	)
	expect(startChatButton.form).toHaveAttribute('action', routeUrl)
	expect(startChatButton.form).toHaveAttribute('method', 'post')
})

test('Link to chat is link to specific chat if logged in, not self, and there is a history', async () => {
	// 🐨 call setup here and delete the stuff setup handles
	const oneOnOneChatId = faker.string.uuid()
	const user = {
		imageId: faker.string.uuid(),
		username: faker.internet.userName(),
		name: faker.person.fullName(),
	}
	const App = createRemixStub([
		{
			path: '/users/:username/host',
			element: (
				<UserProfileBasicInfo
					user={user}
					rating={null}
					userJoinedDisplay={new Date().toLocaleDateString()}
					userLoggedIn={true}
					isSelf={false}
					oneOnOneChatId={oneOnOneChatId}
					stats={[]}
					bio={null}
				/>
			),
		},
	])

	const routeUrl = `/users/${user.username}/host`
	render(<App initialEntries={[routeUrl]} />)

	const chatLink = await screen.findByRole('link', {
		name: /message/i,
	})
	expect(chatLink).toHaveAttribute('href', `/chats/${oneOnOneChatId}`)
})

test('Link to chat is link to all chats if viewing it myself along with edit profile link', async () => {
	// 🐨 call setup here and delete the stuff setup handles
	const user = {
		imageId: faker.string.uuid(),
		username: faker.internet.userName(),
		name: faker.person.fullName(),
	}
	const App = createRemixStub([
		{
			path: '/users/:username/host',
			element: (
				<UserProfileBasicInfo
					user={user}
					rating={null}
					userJoinedDisplay={new Date().toLocaleDateString()}
					userLoggedIn={true}
					isSelf={true}
					oneOnOneChatId={null}
					stats={[]}
					bio={null}
				/>
			),
		},
	])

	const routeUrl = `/users/${user.username}/host`
	render(<App initialEntries={[routeUrl]} />)

	const myChatLink = await screen.findByRole('link', {
		name: /my chat/i,
	})
	expect(myChatLink).toHaveAttribute('href', '/chats')
	const editProfileLink = await screen.findByRole('link', {
		name: /edit profile/i,
	})
	expect(editProfileLink).toHaveAttribute('href', '/settings/profile')
})

test('Link to chat is links to login if user is not logged in', async () => {
	// 🐨 call setup here and delete the stuff setup handles
	const user = {
		imageId: faker.string.uuid(),
		username: faker.internet.userName(),
		name: faker.person.fullName(),
	}
	const App = createRemixStub([
		{
			path: '/users/:username/host',
			element: (
				<UserProfileBasicInfo
					user={user}
					rating={null}
					userJoinedDisplay={new Date().toLocaleDateString()}
					userLoggedIn={false}
					isSelf={false}
					oneOnOneChatId={null}
					stats={[]}
					bio={null}
				/>
			),
		},
	])

	const routeUrl = `/users/${user.username}/host`
	render(<App initialEntries={[routeUrl]} />)

	const links = await screen.findAllByRole('link', { name: /message/i })
	const messageLink = links.find(
		l => l.getAttribute('title') === 'Login to message',
	)
	expect(messageLink).toHaveAttribute(
		'href',
		`/login?${new URLSearchParams({ redirectTo: routeUrl })}`,
	)
})
