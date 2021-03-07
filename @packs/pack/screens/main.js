import React from 'react'
import { Elems, Actheme } from 'pack'
import Actstore from 'actstore'
import { GET } from 'fetchier'

function MainScreen(props) {
  const { store, action, act, handle } = Actstore({}, ['user', 'posts'])
  const { user, posts, } = store.get('user', 'posts')

  console.log({ user, posts })
  // if(!posts) return null

  return <Inner.Container>
    <Inner.Wrap>
      <Button.Comp source="https://techcrunch.com/wp-content/uploads/2018/07/logo-2.png" text="Logo" logo size="s20" />
      <Inner.Menu>
        <Inner.Tabs>
          <Button.Comp tab text="Images" />
          <Button.Comp tab text="Videos" />
        </Inner.Tabs>
        <Inner.Content>
          {!posts
            ? <Button.Comp icon="spinner-third" iconColor="black" iconSize="s10" spin />
            : posts.map((post, index) => <Post.Comp key={index} post={post} />)}
        </Inner.Content>
      </Inner.Menu>
    </Inner.Wrap>
    <Inner.Footer>
      <Button.Comp icon="info-circle" iconColor="black" iconSize="s10" info onPress={action('APP_LOGIN')} />
    </Inner.Footer>
  </Inner.Container>
}
export default MainScreen

const Inner = Actheme.create({
  Container: ['View', 'f:1 bg:black50'],
  Wrap: ['View', 'f:1 w:100% ai:c', { md: 'fd:row ai:fs' }],
  Menu: ['View', 'f:1 w,h:100%'],
  Tabs: ['View', 'fd:row w:100% jc:c', { md: 'p:s5' }],
  Content: ['ScrollView', ['f:1', { contentContainerStyle: Actheme.style('fg:1 jc:c fd:row fw:wrap ph:s5') }]],
  Footer: ['View', 'ps:ab b,l:0 p:s5 z:2']
})

const Button = Actheme.create({
  Touch: ['TouchableOpacity', 'jc,ai:c', { tab: 'mh:s5 p:s5 fs:s20', info: 'bg:#e5e5e5 br:s20', logo: 'm:s5' }],
  Text: ['Text', ['ta:c c:black fb:500 w:100%', { numberOfLines: 1 }], { tab: 'fs:s5' }],
  Image: ['Image', 'w,h:100%'],
  Comp: ({text, source, info, logo, size, icon, iconColor, iconSize, spin, tab, ...props}) => {
    return <Button.Touch info={info} logo={logo} tab={tab} logo={logo} style={Actheme.style(`w,h:${size || 'auto'}`)} {...props}>
      {source && <Button.Image source={source} />}
      {icon && <Elems.Icon color={Actheme.value(iconColor, 'color')} style={Actheme.style(`fs:${iconSize}`)} icon={icon} spin={spin} />}
      {text && <Button.Text tab={tab}>{text}</Button.Text>}
    </Button.Touch>
  }
})

const Post = Actheme.create({
  Touch: ['TouchableOpacity', 'w:100% xw,h:s100 jc,ai:c bw:1 bc:blacka2 br:s5 of:hd m:s5'],
  Image: ['Image', 'w,h:100%'],
  Comp: ({post, ...props}) => {
    return <Post.Touch {...props}>
      <Post.Image source={post.url} />
      {console.log(post)}
    </Post.Touch>
  }
})
