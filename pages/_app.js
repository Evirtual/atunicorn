import React from 'react'
import Actstore from 'pack/store/actstore'
import Settings from 'pack/store'
import Layout from 'pack/comps/layout'
import { ThemeProvider } from 'pack/theme'

import '../styles/icons.css'

const App = ({ Component, pageProps }) => {
  const { act } = Actstore(Settings)

  React.useEffect(() => {
    let cleanup
    let active = true

    act('APP_INIT').then(dispose => {
      if (active) cleanup = dispose
      else dispose()
    }).catch(() => {})

    return () => {
      active = false
      cleanup?.()
    }
  }, [act])

  return (
    <ThemeProvider>
      <Layout>
        <main style={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column' }}>
          <Component {...pageProps} />
        </main>
      </Layout>
    </ThemeProvider>
  )
}

export default App
