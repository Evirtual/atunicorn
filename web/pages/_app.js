import React, { useEffect } from 'react'
import Router from 'next/router'
import Actstore from 'actstore'
import Settings from 'pack/store'
import Layout from 'pack/comps/layout'

import '@fortawesome/fontawesome-svg-core/styles.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fal } from '@fortawesome/pro-light-svg-icons'
import { far } from '@fortawesome/pro-regular-svg-icons'
import { fad } from '@fortawesome/pro-duotone-svg-icons'
import { fas } from '@fortawesome/pro-solid-svg-icons'
import { fab } from '@fortawesome/free-brands-svg-icons'

library.add(fal, far, fad, fas, fab)

/** Install pro
  npm config set "@fortawesome:registry" https://npm.fontawesome.com/
  npm config set "//npm.fontawesome.com/:_authToken" 2C14ED20-7F10-4AB4-9C27-184BDD7CBFD8
*/

const App = ({ Component, pageProps }) => {
	const { act } = Actstore(Settings, ['ready'])

	React.useEffect(() => {
		((window?.location?.pathname || '/') !== (Router?.router?.route || '/')) && Router.push(Router.router.asPath) 
		act('APP_INIT')
	}, [])

	useServiceWorker()

  return (
		<React.Fragment>
			<Layout />
			<Component {...pageProps} />
		</React.Fragment>
	)
}

App.getInitialProps = async ({ Component, router, ctx }) => {
  const pageProps = Component.getInitialProps && await Component.getInitialProps(ctx) || {}
  const { asPath } = ctx

  const { route, query } = router
  return { pageProps, route, query, asPath }
}

const useServiceWorker = () => {
  useEffect(() => {
    if(typeof document !== 'object') return
    
    if('serviceWorker' in window.navigator)
      window.navigator.serviceWorker.register('/static/sw.js').then( 
        ({ scope }) => console.log('ServiceWorker registered ', scope),
        (err) =>  console.log('ServiceWorker failed: ', err)
      )
  }, [])
}

export default App
