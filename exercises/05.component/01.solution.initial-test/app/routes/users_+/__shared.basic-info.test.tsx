import { expect, test } from 'vitest'
import { faker } from '@faker-js/faker'
import { render, screen } from '@testing-library/react'
import { unstable_createRemixStub as createRemixStub } from '@remix-run/testing'
import { UserProfileBasicInfo } from './__shared.tsx'
import invariant from 'tiny-invariant'

test('Link to chat is a form if user is logged in, is not self, and no chat exists yet', async () => {
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
