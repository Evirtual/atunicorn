import React from 'react'
import { Elems, Actheme } from 'pack'
import Actstore from 'actstore'
import { GET } from 'fetchier'

function MainScreen(props) {
  const { store, action, act, handle } = Actstore({}, ['user', 'posts'])
  const { user, posts, } = store.get('user', 'posts')

  console.log({ user, posts })
  if(!posts) return null

  return <Inner.Container>
    <Inner.Wrap>
      <Button.Comp source="https://techcrunch.com/wp-content/uploads/2018/07/logo-2.png" text="Logo" logo size="s20" />
      <Inner.Tabs>
        <Button.Comp tab text="Images" />
        <Button.Comp tab text="Videos" />
      </Inner.Tabs>
    </Inner.Wrap>
    <Inner.Footer>
      <Button.Comp icon="info-circle" iconColor="black" iconSize="s10" info />
    </Inner.Footer>
  </Inner.Container>
}
export default MainScreen

const Inner = Actheme.create({
  Container: ['View', 'f:1 bg:black50'],
  Wrap: ['View', 'w:100% ai:c p:s5', { md: 'fd:row jc:sb' }],
  Tabs: ['View', 'fd:row jc:c mv:s5', { md: 'mv:0' }],
  Footer: ['View', 'fd:row jc:c ps:ab b,l,r:0 p:s5', { md: 'jc:fs' }]
})

const Button = Actheme.create({
  Touch: ['TouchableOpacity', 'jc,ai:c', { tab: 'mh:s5 p:s5 fs:s20' }],
  Text: ['Text', ['ta:c c:black fb:500 w:100%', { numberOfLines: 1 }], { tab: 'fs:s5' }],
  Image: ['Image', 'w,h:100%'],
  Comp: ({text, source, info, logo, size, icon, iconColor, iconSize, tab}) => {
    return <Button.Touch info={info} logo={logo} tab={tab} style={Actheme.style(`w,h:${size || 'auto'}`)}>
      {source && <Button.Image source={source} />}
      {icon && <Elems.Icon color={Actheme.value(iconColor, 'color')} style={Actheme.style(`fs:${iconSize}`)} icon={icon} />}
      {text && <Button.Text tab={tab}>{text}</Button.Text>}
    </Button.Touch>
  }
})
