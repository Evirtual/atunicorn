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
  static async getInitialProps(ctx) {
    const appName = process.env.name || 'main';
    AppRegistry.registerComponent(appName, () => Main);

    const initialProps = await Document.getInitialProps(ctx);
    const { getStyleElement } = AppRegistry.getApplication(appName) || {};
    const styleElements = getStyleElement ? getStyleElement() : null;

    const mergedStyles = [initialProps.styles, styleElements, (
      <style
        key="actheme-styles"
        dangerouslySetInnerHTML={{ __html: [nextStyle, Actheme.mediaRules()].join('\n') }}
      />
    )]
      .flat()
      .filter(Boolean)
      .map((style, index) =>
        React.isValidElement(style) && style.key == null
          ? React.cloneElement(style, { key: `actheme-style-${index}` })
          : style
      );

    return { ...initialProps, styles: mergedStyles };
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
