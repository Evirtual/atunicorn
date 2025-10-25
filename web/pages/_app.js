import React, { useEffect } from 'react'
import Router from 'next/router'
import { StoreProvider, useStore } from 'pack/store'
import Layout from 'pack/comps/layout'

const App = ({ Component, pageProps }) => {
  const { initialState, ...componentProps } = pageProps || {}

  return (
    <StoreProvider initialState={initialState}>
      <AppContainer Component={Component} pageProps={componentProps} />
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
