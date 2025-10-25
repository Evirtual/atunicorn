import React, { useState } from 'react'
import PostScreen from 'pack/screens/post'
import { useStoreContext } from 'pack/store'
import configs from 'pack/store/configs'

const PostPage = ({ postId }) => {
	const { state, act, handle } = useStoreContext()
	const { user, users, posts } = state || {}

	const router = handle.useRouter()
	const { id } = router?.query || {}
	const currentId = id || postId

	const [mode, setMode] = useState(false)
	const [profileId, setProfileId] = useState(null)

	return (
		<PostScreen
			act={act}
			user={user}
			users={users}
			posts={posts}
			router={router}
			id={currentId}
			mode={mode}
			setMode={setMode}
			profileId={profileId}
			setProfileId={setProfileId}
		/>
	)
}

export default PostPage

export const getServerSideProps = async ({ params }) => {
	const id = params?.id || null
	const initialState = { posts: [], users: [] }

	if (!id) {
		return { props: { initialState: { ...initialState, ready: true } } }
	}

	const baseUrl = configs?.firebase?.databaseUrl
	if (!baseUrl) {
		return {
			props: {
				initialState: { ...initialState, ready: true },
				postId: id
			}
		}
	}

	const databaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`

	try {
		const response = await fetch(`${databaseUrl}posts.json`)
		if (response.ok) {
			const rawPosts = await response.json()
			const posts = Object.values(rawPosts || {}).reduce((acc, userPosts) => {
				if (!userPosts || typeof userPosts !== 'object') return acc
				return acc.concat(Object.values(userPosts).filter(Boolean))
			}, [])
			const post = posts.find(item => String(item?.id) === String(id))
			if (post) {
				initialState.posts = [post]
				if (post.userId) {
					const userResponse = await fetch(`${databaseUrl}users/${post.userId}.json`)
					if (userResponse.ok) {
						const user = await userResponse.json()
						if (user) {
							initialState.users = [user]
						}
					}
				}
			}
		}
	} catch (error) {
		console.warn('Failed to prefetch post data', error)
	}

	return {
		props: {
			initialState: { ...initialState, ready: true },
			postId: id
		}
	}
}
