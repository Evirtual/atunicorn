import Document, { Head, Main, NextScript, Html } from 'next/document'
import React from 'react'
import { AppRegistry } from 'react-native-web'
import Actheme from 'actheme'

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
  static async getInitialProps({ renderPage }) {
    AppRegistry.registerComponent(process.env.name, () => Main)
    const { getStyleElement } = AppRegistry.getApplication(process.env.name)
    const page = renderPage()
    const StyleElements = getStyleElement()
    const styles = [
      StyleElements,
      <style dangerouslySetInnerHTML={{ __html: [nextStyle, Actheme.mediaRules()].join('\n') }} />
    ]
    return { ...page, styles: React.Children.toArray(styles) };
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
