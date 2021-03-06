import React from 'react'
import Actstore from 'actstore'
import Head from 'next/head'
import Settings from 'pack/store'

const App = ({ Component, pageProps }) => {
	const { store, act } = Actstore(Settings, ['ready'])
	React.useEffect(() => { act('APP_INIT') }, [])
  return <React.Fragment>
		<Head>
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<title>{process.env.name}</title>
			{/* <link rel="shortcut icon" type="image/x-icon" href="./static/favicon.ico" />
			<link rel="icon" type="image/x-icon" href="./static/favicon.ico" />
			<link font-src="https://fonts.googleapis.com/css?family=Nunito:200,300,400,600,700" href="https://fonts.googleapis.com/css?family=Nunito:200,300,400,600,700" rel="stylesheet" /> */}
			<style type="text/css">{`
			  input:focus:not(.focus-visible) {
			    outline: none;
			  }
			`}</style>
		</Head>
		<Component {...pageProps} />
	</React.Fragment>
}

export default App
