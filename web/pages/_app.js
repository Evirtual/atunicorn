import React, { useEffect } from 'react'
import Router from 'next/router'
import { StoreProvider, useStore } from 'pack/store'
import Layout from 'pack/comps/layout'

const App = ({ Component, pageProps }) => {

  return (
    <StoreProvider>
      <AppContainer {...{ Component, pageProps }} />
    </StoreProvider>
  )
}

const AppContainer = ({ Component, pageProps }) => {
  const { act } = useStore()
  
  useServiceWorker()

  useEffect(() => {
		((window?.location?.pathname || '/') !== (Router?.router?.route || '/')) &&
      Router.push(Router.router.asPath) 
    act('APP_INIT')
	}, [act])

  return (
		<Layout>
			<Component {...pageProps} />
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
