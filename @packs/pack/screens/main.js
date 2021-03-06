import React from 'react'
import { Elems, Actheme } from 'pack'
import Actstore from 'actstore'
import { GET } from 'fetchier'

function MainScreen(props) {
  const { store, action, act, handle } = Actstore({}, ['update', 'info'])

  return <>
    <Inner.Wrap>
      <Button.Comp source="https://techcrunch.com/wp-content/uploads/2018/07/logo-2.png" logo />
      <Button.Comp source="https://img.icons8.com/pastel-glyph/2x/info.png" info />
    </Inner.Wrap>
  </>
}
export default MainScreen

const Inner = Actheme.create({
  Wrap: ['View', 'f:1 bg:black50'],
})

const Button = Actheme.create({
  Touch: ['TouchableOpacity', 'w,h:s20', { info: 'ps:ab l,b:s5', logo: 'ps:ab l,t:s5' }],
  Text: ['Text', ['c:white ta:c w:100%', { numberOfLines: 1 }]],
  Image: ['Image', 'w,h:100%'],
  Comp: ({text, source, info, logo}) => {
    return <Button.Touch info={info} logo={logo}>
      {source && <Button.Image source={source} />}
      {text && <Button.Text>{text}</Button.Text>}
    </Button.Touch>
  }
})