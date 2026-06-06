import React from 'react'
import Head from 'next/head'

const Meta = (props) => {

  const { title, desc, url, cover } = props

  return (
    <Head>
      <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1" />
      <meta key="author" name="author" content="@unicorn" />
      <title key="title">{desc ? `@${title} - ${desc}` : title ? `@${title}` : "@unicorn"}</title>
      <meta key="meta-title" name="title" content={desc ? `@${title} - ${desc}` : title ? `@${title}` : "@unicorn"} />
      <meta key="description" name="description" content={desc ? desc : "It's a place to express your uniqueness in ways that inspire us to feel more confident in our everyday life"} />
      {/* facebook */}
      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:url" property="og:url" content={url ? url : "https://atunicorn.io/"} />
      <meta key="og:title" property="og:title" content={title ? `@${title}` : "@unicorn"} />
      <meta key="og:description" property="og:description" content={desc ? desc : "It's a place to express your uniqueness in ways that inspire us to feel more confident in our everyday life"} />
      <meta key="og:image" property="og:image" content={cover ? `${cover}.png` : "https://atunicorn.io/static/unicover-updated.png"} />
      <meta key="og:image:type" property="og:image:type" content="image/png" /> 
      <meta key="og:image:width" property="og:image:width" content="1200" />
      <meta key="og:image:height" property="og:image:height" content="630" />
      {/* twitter */}
      <meta key="twitter:card" property="twitter:card" content="summary_large_image" />
      <meta key="twitter:url" property="twitter:url" content={url ? url : "https://atunicorn.io/"} />
      <meta key="twitter:title" property="twitter:title" content={title ? `@${title}` : "@unicorn"} />
      <meta key="twitter:description" property="twitter:description" content={desc ? desc : "It's a place to express your uniqueness in ways that inspire us to feel more confident in our everyday life"} />
      <meta key="twitter:image" property="twitter:image" content={cover ? `${cover}.png` : "https://atunicorn.io/static/unicover-updated.png"} />
      <meta key="mobile-web-app-capable" name="mobile-web-app-capable" content="yes" />
      <meta key="apple-mobile-web-app-capable" name="apple-mobile-web-app-capable" content="yes" />
      <meta key="application-name" name="application-name" content="@unicorn"/>
      <meta key="msapplication-TileColor" name="msapplication-TileColor" content="#FFFFFF" />
      <meta key="msapplication-square150x150logo" name="msapplication-square150x150logo" content="/static/mstile-310x310.png" />
      <link key="shortcut-icon" rel="shortcut icon" type="image/x-icon" href="/static/favicon.ico" />
      <link key="icon-x-icon" rel="icon" type="image/x-icon" href="/static/favicon.ico" />
      <link key="icon-196" rel="icon" type="image/png" href="/static/favicon-196x196.png" sizes="196x196" />
      <link key="icon-32" rel="icon" type="image/png" href="/static/favicon-32x32.png" sizes="32x32" />
      <link key="icon-16" rel="icon" type="image/png" href="/static/favicon-16x16.png" sizes="16x16" />
      <link key="apple-touch-icon" rel="apple-touch-icon-precomposed" sizes="152x152" href="/static/apple-touch-icon-152x152.png" />
      <link key="manifest" rel="manifest" href="/static/manifest.json" />
    </Head>
  )
}

export default Meta