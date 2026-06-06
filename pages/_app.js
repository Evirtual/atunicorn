import React, { useEffect } from 'react'
import Actstore from 'pack/store/actstore'
import Settings from 'pack/store'
import Layout from 'pack/comps/layout'
import { ThemeProvider } from 'pack/theme'

import '../styles/icons.css'

const App = ({ Component, pageProps }) => {

  const { act } = Actstore(Settings, ['ready'])
  
  useServiceWorker()

  React.useEffect(() => {
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

const useServiceWorker = () => {
  useEffect(() => {
    if(typeof document !== 'object') return
    
    if('serviceWorker' in window.navigator)
      window.navigator.serviceWorker.register('/sw.js').then( 
        ({ scope }) => process.env.NODE_ENV !== 'production' && console.log('ServiceWorker registered ', scope),
        (err) =>  process.env.NODE_ENV !== 'production' && console.log('ServiceWorker failed: ', err)
      )
  }, [])
}

export default App
