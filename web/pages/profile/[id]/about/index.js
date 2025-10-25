import React from 'react'
import ProfileScreen from 'pack/screens/profile'
import { useStoreContext } from 'pack/store'
import { fetchProfileInitialState } from '../../../../lib/profileData'

const ProfileAboutPage = ({ profileId: initialProfileId }) => {
	const { handle } = useStoreContext()
	const router = handle.useRouter()
	const { id } = router?.query || {}
	const profileId = id || initialProfileId

	return <ProfileScreen profileId={profileId} />
}

export default ProfileAboutPage

export const getServerSideProps = async ({ params }) => {
	const id = params?.id || null
	const { initialState, profileId } = await fetchProfileInitialState(id)

	return {
		props: {
			initialState,
			profileId
		}
	}
}
