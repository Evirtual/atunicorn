import React, { useState, useEffect } from 'react'
import Router from 'next/router'
import Actstore from 'actstore'
import Settings from 'pack/store'
import Layout from 'pack/comps/layout'
import About from 'pack/screens/about'

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
  
  useServiceWorker()

	const { act, store, handle } = Actstore(Settings, ['ready', 'user', 'user', 'posts'])
  const { user, users } = store.get('user', 'users')

  const router = handle.useRouter()
  const { id } = router.query || {}
  const path = router.asPath || null

  const data = store.get('posts') || []
  const [mode, setMode] = useState(false)

  React.useEffect(() => {
		((window?.location?.pathname || '/') !== (Router?.router?.route || '/')) &&
      Router.push(Router.router.asPath) 
		act('APP_INIT')
	}, [])

  return (
		<Layout>
			<Component 
        act={act}
        store={store}
        router={router}
        path={path}
        urlId={id}
        user={user}
        users={users}
        data={data}
        mode={mode}
        setMode={setMode}
        {...pageProps} />

      {mode === 'about' &&
        <About 
          act={act}
          store={store}
          router={router}
          path={path}
          urlId={id}
          user={user}
          users={users}
          mode={mode} 
          setMode={setMode} />
      }

    </Layout>
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
      window.navigator.serviceWorker.register('/sw.js').then( 
        ({ scope }) => console.log('ServiceWorker registered ', scope),
        (err) =>  console.log('ServiceWorker failed: ', err)
      )
  }, [])
}

export default App
