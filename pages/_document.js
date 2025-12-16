import Document, { Head, Main, NextScript, Html } from 'next/document'
import React from 'react'
import { AppRegistry } from 'react-native-web'
import { ServerStyleSheet } from 'styled-components'

const nextStyle = `
  #__next { display: flex; flex-direction: column; height:100vh; }
  a {color: inherit; text-decoration: inherit;}
  img[class^="css-"][src*="#image"] { opacity: 1 !important; position: relative !important; height: auto !important; align-self:center; }
  div[class*="r-backgroundSize-"][class*="r-backgroundPosition-"][style*="#image"] { opacity: 0; }
  textarea:focus {outline: none; outlineStyle: none;}
  input:focus {outline: none; outlineStyle: none;}
  button:focus {outline: none; outlineStyle: none;}
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
      ]

      return { ...initialProps, styles: React.Children.toArray(styles) }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html style={{backgroundColor: "grey", height: "100vh"}}>
        <Head />
        <body style={{backgroundColor: "grey", height: "100vh"}}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
