import React, { useEffect } from 'react'
import Router from 'next/router'
import Actstore from 'pack/store/actstore'
import Settings from 'pack/store'
import Layout from 'pack/comps/layout'
import { ThemeProvider } from 'pack/theme'

import '../styles/icons.css'

const App = ({ Component, pageProps }) => {

  const { act } = Actstore(Settings, ['ready'])
  
  useServiceWorker()

  React.useEffect(() => {
		((window?.location?.pathname || '/') !== (Router?.router?.route || '/')) &&
      Router.push(Router.router.asPath) 
		act('APP_INIT')
	}, [])

  return (
    <ThemeProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
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
