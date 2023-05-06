import { json, type DataFunctionArgs } from '@remix-run/node'
import { NavLink, Outlet, useLoaderData } from '@remix-run/react'
import clsx from 'clsx'
import { requireUserId } from '~/utils/auth.server'
import { prisma } from '~/utils/db.server'
import { formatDate, getUserImgSrc, listify, useUser } from '~/utils/misc'

export async function loader({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request)
	const chats = await prisma.chat.findMany({
		where: { users: { some: { id: userId } } },
		select: {
			id: true,
			users: {
				select: {
					id: true,
					name: true,
					username: true,
					imageId: true,
				},
			},
			messages: {
				// get the last sent message
				take: 1,
			},
		},
	})
	return json({
		chats: chats.map(c => {
			return {
				...c,
				messages: c.messages.map(m => {
					return {
						...m,
						formattedDate: formatDate(m.createdAt),
					}
				}),
			}
		}),
	})
}

export default function ChatsRoute() {
	const data = useLoaderData<typeof loader>()
	const user = useUser()
	return (
		<div className="container mx-auto mb-20 h-[70vh]">
			<div className="bg-night-500 mt-8 flex h-full rounded-3xl">
				<div className="border-r-night-400 w-[424px] border-r-[1.5px]">
					<div className="border-b-night-400 flex h-20 items-center border-b-[1.5px] px-8">
						<h1 className="text-h5">Messages</h1>
					</div>
					<ul className="mt-6 w-full overflow-y-scroll">
						{data.chats.map(chat => {
							const otherUsers = chat.users.filter(u => u.id !== user.id)
							return (
								<li key={chat.id} className="">
									<NavLink
										to={chat.id}
										className={({ isActive }) =>
											clsx(
												'flex h-20 w-full gap-4 px-8 py-3',
												isActive
													? 'is-active bg-night-400 group'
													: 'hover:bg-night-600 focus:bg-night-600',
											)
										}
										prefetch="intent"
									>
										<img
											className="h-14 w-14 items-center justify-start rounded-full object-cover"
											alt={
												otherUsers[0]?.name ??
												otherUsers[0]?.username ??
												'Unknown user'
											}
											src={getUserImgSrc(otherUsers[0]?.imageId)}
										/>
										<div className="flex flex-col gap-1">
											<div className="flex justify-between">
												<div className="text-sm font-bold">
													{listify(otherUsers, {
														stringify: u => u.name ?? u.username,
													})}
												</div>
												{chat.messages.length ? (
													<time className="text-night-300 whitespace-nowrap text-xs">
														{chat.messages[0].formattedDate}
													</time>
												) : null}
											</div>
											<div className="text-night-200 line-clamp-1 text-sm group-[.is-active]:text-white">
												{chat.messages[0]?.content}
											</div>
										</div>
									</NavLink>
								</li>
							)
						})}
					</ul>
				</div>
				<div className="flex flex-1">
					<Outlet />
				</div>
			</div>
		</div>
	)
}
