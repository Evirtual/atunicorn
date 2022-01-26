import Document, { Head, Main, NextScript, Html } from 'next/document'
import React from 'react'
import { AppRegistry } from 'rnwc'
import Actheme from 'actheme'

const nextStyle = `
  #__next { display: flex; flex-direction: column; height: 100%; }
  img[class^="css-"][src*="#image"] { opacity: 1 !important; position: relative !important; height: auto !important; align-self:center; }
  div[class*="r-backgroundSize-"][class*="r-backgroundPosition-"][style*="#image"] { opacity: 0; }
`

export default class MyDocument extends Document {
  static async getInitialProps({ renderPage }) {
    AppRegistry.registerComponent(process.env.name, () => Main)
    const { getStyleElement } = AppRegistry.getApplication(process.env.name)
    const page = renderPage()
    const StyleElements = getStyleElement()
    const styles = [
      StyleElements,
      <style dangerouslySetInnerHTML={{ __html: [nextStyle, Actheme.mediaRules()].join('\n') }} />
    ]
    console.log('rendered style length', StyleElements.props.dangerouslySetInnerHTML.__html.length)
    return { ...page, styles: React.Children.toArray(styles) };
  }

  render() {
    return (
      <Html style={{ height: "100%" }}>
        <Head />
        <body style={{ height: "100%", overflow: "hidden" }}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
