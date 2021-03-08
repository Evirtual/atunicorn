import React from 'react'
import { Elems, Actheme } from 'pack'
import Actstore from 'actstore'
import { GET } from 'fetchier'

function MainScreen(props) {
  const { store, action, act, handle } = Actstore({}, ['user', 'posts'])
  const { user, posts, } = store.get('user', 'posts')
  const [ mode, setMode ] = React.useState()

  return <Inner.Container>
    <Inner.Menu>
      <Button.Comp source="https://techcrunch.com/wp-content/uploads/2018/07/logo-2.png" text="Logo" logo size="s15" />
      <Inner.Tabs>
        <Button.Comp tab text="Images" />
        <Button.Comp tab text="Videos" />
      </Inner.Tabs>
    </Inner.Menu>
    <Inner.Content>
      {!posts
        ? <Button.Comp icon="spinner-third" spin />
        : mode != 'post' && posts.map((post, index) => <Post.Comp key={index} post={post} />)}
      {mode === 'post' && <Upload.Comp action={files => act('APP_UPLOAD', files).then(url => act('APP_POST', { url, desc: 'new automated post' }))} />}
    </Inner.Content>
    <Button.Comp icon="info-circle" info onPress={() => alert('In progress...')} />
    {!user
      ? <Button.Comp icon="user-circle" user onPress={action('APP_LOGIN')} />
      : mode === 'post' 
        ? <Button.Comp icon="times-circle" user iconColor="red" onPress={() => setMode()} />
        : <Button.Comp icon="plus-circle" user iconColor="green" onPress={() => setMode('post')} />
    }
  </Inner.Container>
}

export default MainScreen

const Inner = Actheme.create({
  Container: ['View', 'f:1 bg:black50'],
  Menu: ['View', 'bbw:1 bbc:black50', { md: 'fd:row jc:sb' }],
  Tabs: ['View', 'fd:row jc:c p:s5'],
  Content: ['ScrollView', ['f:1', { contentContainerStyle: Actheme.style('fg:1 ai,jc:c fd:row fw:wrap p:s5'), showsVerticalScrollIndicator: false }]],
})

const Button = Actheme.create({
  Touch: ['TouchableOpacity', 'jc,ai:c', {
    tab: 'mh:s5 fs:s20',
    info: 'bg:#e5e5e5 br:s20 ps:ab b,l:s5 z:2',
    user: 'bg:#e5e5e5 br:s20 ps:ab b,r:s5 z:2',
    logo: 'as:c m:s5'}],
  Text: ['Text', ['ta:c c:black fb:500 w:100%', { numberOfLines: 1 }], { tab: 'fs:s5' }],
  Image: ['Image', 'w,h:100%'],
  Comp: ({text, source, info, logo, size, icon, iconColor, iconSize, spin, tab, ...props}) => {
    return <Button.Touch info={info} logo={logo} tab={tab} logo={logo} style={Actheme.style(`w,h:${size || 'auto'}`)} {...props}>
      {source && <Button.Image source={source} />}
      {icon && <Elems.Icon color={Actheme.value(iconColor, 'color') || 'black'} style={Actheme.style(`fs:${iconSize || 's10'}`)} icon={icon} spin={spin} />}
      {text && <Button.Text tab={tab}>{text}</Button.Text>}
    </Button.Touch>
  }
})

const Upload = Actheme.create({
  Touch: ['TouchableOpacity', 'w:100% xw,h:s100 jc,ai:c bw:1 bc:black100 br:s5 of:hd m:s5'],
  File: 'Upload',
  Text: ['Text', ['ta:c c:black fb:500 w:100% mt:s5', { numberOfLines: 1 }]],
  Comp: props => <Upload.Touch>
    <Upload.File {...props}>
      <Elems.Icon style={Actheme.style('c:black fs:s20')} icon="plus-circle"/>
    </Upload.File>
    <Upload.Text>Upload Picture</Upload.Text>
  </Upload.Touch>
})

const Post = Actheme.create({
  Touch: ['TouchableOpacity', 'w:100% xw,h:s100 jc,ai:c bw:1 bc:black100 br:s5 of:hd m:s5'],
  Image: ['Image', 'w,h:100%'],
  Comp: ({post, ...props}) => {
    return <Post.Touch {...props}>
      <Post.Image source={post.url} />
    </Post.Touch>
  }
})
