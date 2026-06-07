import React from 'react'
import Head from 'next/head'

const Meta = (props) => {

  const { title, desc, url, cover } = props
  const pageTitle = desc ? `@${title} - ${desc}` : title ? `@${title}` : '@unicorn'
  const pageDescription = desc ? desc : "It's a place to express your uniqueness in ways that inspire us to feel more confident in our everyday life"
  const pageUrl = url ? url : 'https://atunicorn.io/'
  const pageImage = cover ? `${cover}.png` : 'https://atunicorn.io/static/unicover-updated.png'
  const headItems = [
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    ['meta', { name: 'author', content: '@unicorn' }],
    ['title', pageTitle],
    ['meta', { name: 'title', content: pageTitle }],
    ['meta', { name: 'description', content: pageDescription }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: pageUrl }],
    ['meta', { property: 'og:title', content: title ? `@${title}` : '@unicorn' }],
    ['meta', { property: 'og:description', content: pageDescription }],
    ['meta', { property: 'og:image', content: pageImage }],
    ['meta', { property: 'og:image:type', content: 'image/png' }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { property: 'twitter:url', content: pageUrl }],
    ['meta', { property: 'twitter:title', content: title ? `@${title}` : '@unicorn' }],
    ['meta', { property: 'twitter:description', content: pageDescription }],
    ['meta', { property: 'twitter:image', content: pageImage }],
    ['meta', { name: 'mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'application-name', content: '@unicorn' }],
    ['meta', { name: 'msapplication-TileColor', content: '#FFFFFF' }],
    ['meta', { name: 'msapplication-square150x150logo', content: '/static/mstile-310x310.png' }],
    ['link', { rel: 'shortcut icon', type: 'image/x-icon', href: '/static/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/x-icon', href: '/static/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/static/favicon-196x196.png', sizes: '196x196' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/static/favicon-32x32.png', sizes: '32x32' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/static/favicon-16x16.png', sizes: '16x16' }],
    ['link', { rel: 'apple-touch-icon-precomposed', sizes: '152x152', href: '/static/apple-touch-icon-152x152.png' }],
    ['link', { rel: 'manifest', href: '/static/manifest.json' }]
  ]

  return (
    <Head>
      {headItems.map(([tag, value], index) => {
        if (tag === 'title') {
          return <title key={`title-${index}`}>{value}</title>
        }

        return React.createElement(tag, {
          key: `${tag}-${index}`,
          ...value
        })
      })}
    </Head>
  )
}

export default Meta