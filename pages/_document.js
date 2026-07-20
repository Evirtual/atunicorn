import Document, { Head, Main, NextScript, Html } from 'next/document'
import React from 'react'
import { AppRegistry } from 'react-native-web'
import { ServerStyleSheet } from 'styled-components'

const nextStyle = `
  #__next { display: flex; flex-direction: column; height:100vh; }
  a {color: inherit; text-decoration: inherit;}
  img[class^="css-"][src*="#image"] { opacity: 1 !important; position: relative !important; height: auto !important; align-self:center; }
  div[class*="r-backgroundSize-"][class*="r-backgroundPosition-"][style*="#image"] { opacity: 0; }
  a:focus-visible,
  button:focus-visible,
  input:focus-visible,
  textarea:focus-visible,
  [role="button"]:focus-visible {
    outline: 2px solid #2276d2 !important;
    outline-offset: 2px;
  }
`

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    AppRegistry.registerComponent(process.env.name, () => Main)
    const { getStyleElement } = AppRegistry.getApplication(process.env.name)

    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />)
        })

      const initialProps = await Document.getInitialProps(ctx)
      const rnStyles = getStyleElement()

      const styles = [
        initialProps.styles,
        rnStyles,
        sheet.getStyleElement(),
        <style key="nextStyle" dangerouslySetInnerHTML={{ __html: nextStyle }} />
      ].flatMap((style) => React.Children.toArray(style))

      const keyedStyles = styles.map((style, index) => {
        if (!React.isValidElement(style)) {
          return style
        }

        return React.cloneElement(style, {
          key: style.key ?? `head-style-${index}`
        })
      })

      return { ...initialProps, styles: keyedStyles }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html lang="en" suppressHydrationWarning style={{backgroundColor: "grey", height: "100vh"}}>
        <Head />
        <body suppressHydrationWarning style={{backgroundColor: "grey", height: "100vh"}}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
