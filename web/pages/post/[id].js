import React, { useState } from 'react'
import PostScreen from 'pack/screens/post'
import { useStoreContext } from 'pack/store'

const PostPage = () => {
	const { state, act, handle } = useStoreContext()
	const { user, users, posts } = state || {}

	const router = handle.useRouter()
	const { id } = router?.query || {}

	const [mode, setMode] = useState(false)
	const [profileId, setProfileId] = useState(null)

	return (
		<PostScreen
			act={act}
			user={user}
			users={users}
			posts={posts}
			router={router}
			id={id}
			mode={mode}
			setMode={setMode}
			profileId={profileId}
			setProfileId={setProfileId}
		/>
	)
}

export default PostPage
