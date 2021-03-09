import React from 'react'
import { Elems, Actheme } from 'pack'
import Actstore from 'actstore'
import { GET } from 'fetchier'

function MainScreen(props) {
  const { store, action, act, handle } = Actstore({}, ['user', 'posts'])
  const { user, posts} = store.get('user', 'posts')
  const [ mode, setMode ] = React.useState()

  return <Inner.Container>
    <Inner.Menu>
      <Button.Comp icon="alicorn" text="Unicorn" iconColor="pink" logo />
      <Inner.Tabs>
        <Button.Comp tab text="Images" />
        <Button.Comp tab text="Videos" />
      </Inner.Tabs>
    </Inner.Menu>
    <Inner.Content>
      {!posts
        ? <Button.Comp icon="spinner-third" spin />
        : (mode != 'post' && mode != 'profileView' && mode != 'profileEdit') && posts.map((post, index) => <Post.Comp key={index} post={post} />).reverse()}
      {mode === 'post' && <Upload.Comp onClose={() => setMode()} />}
      {mode === 'profileView' && <ProfileView.Comp />}
      {mode === 'profileEdit' && <ProfileEdit.Comp user={user} />}
    </Inner.Content>
    {!user 
      ? <Button.Comp 
        icon={mode === 'profileView' ? 'times-circle' : 'info-circle'}
        iconColor={mode === 'profileView' ? 'red' : 'black'}
        onPress={mode === 'profileView' ? () => setMode() : () => setMode('profileView')}
        info />
      : <Button.Comp
        icon={mode === 'profileEdit' ? 'times-circle' : 'cog'}
        iconColor={mode === 'profileEdit' ? 'red' : 'blue'}
        onPress={mode === 'profileEdit' ? () => setMode() : () => setMode('profileEdit')}
        info />
      }
    {!user
      ? <Button.Comp icon="user-circle" user onPress={action('APP_LOGIN')} />
      : <Button.Comp
          icon={mode === 'post' ? 'times-circle' : 'plus-circle'}
          iconColor={mode === 'post' ? 'red' : 'green'}
          onPress={mode === 'post' ? () => setMode() : () => setMode('post')}
          user />
    }
  </Inner.Container>
}

export default MainScreen

const Inner = Actheme.create({
  Container: ['View', 'f:1 bg:black50'],
  Menu: ['View', 'bbw:1 bbc:black50 bg:white100', { md: 'fd:row jc:sb' }],
  Tabs: ['View', 'fd:row jc:c p:s5'],
  Content: ['ScrollView', ['f:1', { contentContainerStyle: Actheme.style('fg:1 ai,jc:c fd:row fw:wrap pv:s5 ph:s10 w:100% xw:s400 as:c'), showsVerticalScrollIndicator: false }]],
})

const Button = Actheme.create({
  Touch: ['TouchableOpacity', 'jc,ai:c', {
    tab: 'mh:s5 fs:s20',
    info: 'bg:#e5e5e5 br:s20 ps:ab b,l:s5 z:2',
    user: 'bg:#e5e5e5 br:s20 ps:ab b,r:s5 z:2',
    logo: 'as:c m:s5 w,h:s15',
    post: 'bc:black100 br:s5 bw:2 bc:pink bg:pink h:s15',
    disabled: 'op:0.25'
  }],
  Text: ['Text', ['ta:c c:black fb:500 w:100%', { numberOfLines: 1 }], {
    tab: 'fs:s5',
    logo: 'c:pink',
    post: 'c:white fs:s5' }],
  Image: ['Image', 'w,h:100%'],
  Comp: ({text, source, info, logo, size, icon, iconColor, iconSize, spin, tab, post, disabled, onPress, ...props}) => {
    return <Button.Touch info={info} logo={logo} tab={tab} logo={logo} post={post} disabled={disabled} onPress={!disabled ? onPress : null} {...props}>
      {source && <Button.Image source={source} />}
      {icon && <Elems.Icon color={Actheme.value(iconColor, 'color') || 'black'} style={Actheme.style(`fs:${iconSize || 's10'}`)} icon={icon} spin={spin} />}
      {text && <Button.Text tab={tab} logo={logo} post={post} {...props}>{text}</Button.Text>}
    </Button.Touch>
  }
})

const Upload = Actheme.create({
  Wrap: ['View', 'fd:col w:100% xw:s100'],
  Touch: ['TouchableOpacity', 'w:100% xw,h:s100 jc,ai:c bw:1 bc:black50 bg:white200 br:s5 of:hd mb:s5'],
  File: 'Upload',
  Text: ['Text', ['ta:c c:pink w:100% mt:s5 fs:s4 fb:bold', { numberOfLines: 1 }]],
  Input: ['TextInput', ['c:black fs:s4 mb:s5 p:s5 bw:1 bc:black50 bg:white200 br:s5', { multiline: true, numberOfLines: 2 }], {
    active: 'bc:green'
  }],
  Image: ['Image', 'w:100% xw,h:s100 bw:1 bc:black100 br:s5 of:hd mb:s5 bg:white200'],
  Comp: props => {
    const { action, act } = Actstore({}, [])
    const [active, setActive] = React.useState()
    const [url, setUrl] = React.useState()
    const [desc, setDesc] = React.useState()

    return <Upload.Wrap>
      <Upload.File action={files => act('APP_UPLOAD', files).then(setUrl)}>
        {!url 
          ? <Upload.Touch>
              <Elems.Icon style={Actheme.style('c:pink fs:s20')} icon="plus-circle"/>
              <Upload.Text>Upload Picture</Upload.Text>
            </Upload.Touch>
          : <Upload.Image source={url} />}
      </Upload.File>
      {url && <Upload.Input
        onChangeText={setDesc}
        placeholder="Type your description"
        active={active}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)} />}
      {url && desc && <Button.Comp disabled={!Boolean(desc) || !Boolean(url)} onPress={() => act('APP_POST', { url, desc }).then(props.onClose)} text="Ready to make it public?" post />}
    </Upload.Wrap>
  }
})

const ProfileView = Actheme.create({
  Wrap: ['View', 'fd:col w:100% xw:s100 jc,ai:c'],
  Image: ['Image', 'w,h:s25 mb:s10'],
  Text: ['Text', 'fs:s5 w:100% mb:s5', { pink: 'c:pink fb:bold' }],
  Comp: props => <ProfileView.Wrap>
    <Elems.Icon icon="alicorn" style={Actheme.style('c:pink fs:s25 mb:s10')} />
    <ProfileView.Text>A Unicorn is a mythical creature, someone amazing who is hard to catch or simply a very rare find.</ProfileView.Text>
    <ProfileView.Text>The term is often describing someone who is remarkably attractive, but not at all batshit crazy, amazing at sex, and has a great personality.</ProfileView.Text>
    <ProfileView.Text pink>You may be a Unicorn!</ProfileView.Text>
  </ProfileView.Wrap>
})

const ProfileEdit = Actheme.create({
  Wrap: ['View', 'fd:col w:100% xw:s100'],
  Comp: props => <ProfileEdit.Wrap>
  </ProfileEdit.Wrap>
})

const Post = Actheme.create({
  Touch: ['TouchableOpacity', 'w:100% xw,h:s80 jc,ai:c bw:1 bc:black50 br:s5 of:hd m:s5 bg:white200', { md: 'xw,h:s100' }],
  Image: ['Image', 'w,h:100%'],
  Comp: ({post, ...props}) => {
    return <Post.Touch {...props}>
      <Post.Image source={post.url} />
    </Post.Touch>
  }
})
