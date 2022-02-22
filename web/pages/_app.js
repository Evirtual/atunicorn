import React from 'react'
import Router from 'next/router'
import Actstore from 'actstore'
import Head from 'next/head'
import Settings from 'pack/store'
import Layout from 'pack/comps/layout'

import '@fortawesome/fontawesome-svg-core/styles.css'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fal } from '@fortawesome/pro-light-svg-icons'
import { far } from '@fortawesome/pro-regular-svg-icons'
import { fad } from '@fortawesome/pro-duotone-svg-icons'
import { fas } from '@fortawesome/pro-solid-svg-icons'

library.add(fal, far, fad, fas)

/** Install pro
  npm config set "@fortawesome:registry" https://npm.fontawesome.com/
  npm config set "//npm.fontawesome.com/:_authToken" 2C14ED20-7F10-4AB4-9C27-184BDD7CBFD8
*/

const App = ({ Component, pageProps }) => {
	const { store, act } = Actstore(Settings, ['ready'])

	React.useEffect(() => {
		((window?.location?.pathname || '/') !== (Router?.router?.route || '/')) && Router.push(Router.router.asPath) 
		act('APP_INIT')
	}, [])

  return <React.Fragment>
		<Head>
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta name="author" content="@unicorn" />
			<title>{process.env.name}</title>
			<meta name="description" content="It's a place to express your uniqueness in ways that inspire us to feel more confident in our everyday life" />
			<meta name="title" content={process.env.name} />
			<meta name="description" content="It's a place to express your uniqueness in ways that inspire us to feel more confident in our everyday life" />
			{/* facebook */}
			<meta property="og:type" content="website" />
			<meta property="og:url" content="https://atunicorn.io/" />
			<meta property="og:title" content={process.env.name} />
			<meta property="og:description" content="It's a place to express your uniqueness in ways that inspire us to feel more confident in our everyday life" />
			<meta property="og:image" content="https://atunicorn.io/static/cover.png" />
			<meta property="og:image:type" content="image/png" /> 
			<meta property="og:image:width" content="1200" />
			<meta property="og:image:height" content="630" />
			{/* twitter */}
			<meta property="twitter:card" content="summary_large_image" />
			<meta property="twitter:url" content="https://atunicorn.io/" />
			<meta property="twitter:title" content={process.env.name} />
			<meta property="twitter:description" content="It's a place to express your uniqueness in ways that inspire us to feel more confident in our everyday life" />
			<meta property="twitter:image" content="https://atunicorn.io/static/cover.png" />
			<link rel="shortcut icon" type="image/x-icon" href="/static/favicon.ico" />
			<link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
			<link rel="icon" type="image/png" href="/static/favicon-32x32.png" sizes="32x32" />
			<link rel="icon" type="image/png" href="/static/favicon-16x16.png" sizes="16x16" />
		</Head>
		<Layout />
		<Component {...pageProps} />
	</React.Fragment>
}

App.getInitialProps = async ({ Component, router, ctx }) => {
  const pageProps = Component.getInitialProps && await Component.getInitialProps(ctx) || {}
  const { asPath } = ctx

  const { route, query } = router
  return { pageProps, route, query, asPath }
}

export default App
