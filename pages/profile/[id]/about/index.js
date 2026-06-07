import React from 'react'
import { useRouter } from 'next/router'
import AboutScreen from 'pack/screens/about'
import ProfileScreen from 'pack/screens/profile'
import { resolveRoutePresentation } from 'pack/screens/route-state'
import { useRouteState } from 'pack/screens/use-route-state'

export default function ProfileAboutRoute() {
	const router = useRouter()
	const { currentPath, modalIntent } = useRouteState({ router, initialPath: router.asPath })

	const routePresentation = resolveRoutePresentation({
		path: currentPath,
		profileId: router.query?.id,
		modalIntent,
	})

	if (routePresentation.page === 'profile' && routePresentation.overlay?.kind === 'about') {
		return <ProfileScreen profileId={router.query?.id} modalIntent={modalIntent} />
	}

	return <AboutScreen />
}
