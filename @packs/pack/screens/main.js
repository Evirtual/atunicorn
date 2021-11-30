import React from 'react'
import { Elems, Actheme, Comps } from 'pack'
import Actstore from 'actstore'
import { GET } from 'fetchier'

function MainScreen(props) {
  const { store, action, act, handle } = Actstore({}, ['user', 'posts'])
  const router = handle.useRouter()
  const { user, users } = store.get('user', 'users')
  const { desc, url } = props.profile || {}
  const [ mode, setMode ] = React.useState()
  const { id } = router?.query || {}
  const posts = id ? (store.get('posts') || []).filter(post => post.userId === id) : store.get('posts')

  return <Inner.Container>
    <Inner.Content>
      <Comps.Logo desc={desc} mode={mode} setMode={setMode} onPress={() => router.push(id ? '/' : '/' + user.id)} />
      {mode === 'post' && <Upload.Comp onClose={() => setMode()} />}
      {/* {id && mode !== 'post' && <ProfileView.Comp profile={users?.find(item => item.id === user.id)} />}
      {id && mode !== 'post' && id === user?.id && <ProfileEdit.Comp user={user} />} */}
      {!posts
        ? <Elems.Button icon="spinner-third" spin />
        : mode !== 'post' && posts.map((post, index) => <Post.Comp key={index} post={post} profile={users?.find(item => item.id === post.userId)} />)}
    </Inner.Content>
    {console.log(users)}
  </Inner.Container>
}

export default MainScreen

const Inner = Actheme.create({
  Container: ['View', 'f:1 bg:black25'],
  Content: ['ScrollView', ['f:1', { contentContainerStyle: Actheme.style('jc:c fd:row fw:wrap w:100% xw:s400 as:c'), showsVerticalScrollIndicator: false }]],
})

const Upload = Actheme.create({

  Wrap: ['View', 'fd:col w:100% xw:s100'],
  File: 'Upload',
  Input: ['TextInput', ['c:black fs:s4 mb:s5 p:s5 bw:1 bc:black50 bg:white200 br:s5', { multiline: true, numberOfLines: 2 }], {
    active: 'bc:green'
  }],
  Text: ['Text', ['ta:c c:pink w:100% fs:s4 fb:bold', { numberOfLines: 1 }]],
  Touch: ['TouchableOpacity', 'w:100% xw,h:s100 jc,ai:c bw:1 bc:black50 bg:white200 br:s5 of:hd mb:s5'],
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
              <Elems.Icon style={Actheme.style('c:pink fs:s20 mb:s5')} icon="plus-circle"/>
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
      {url && desc && <Elems.Button disabled={!Boolean(desc) || !Boolean(url)} onPress={() => act('APP_POST', { url, desc }).then(props.onClose)} text="Ready to make it public?" post />}
    </Upload.Wrap>
  }

})

const ProfileView = Actheme.create({

  Wrap: ['View', 'fd:col w:100% xw:s100 jc,ai:c'],
  Image: ['Image', 'w,h:s25 mb:s10'],
  Text: ['Text', 'fs:s5 w:100% mb:s5', { pink: 'c:pink fb:bold' }],

  Comp: props => {
    const { desc, url } = props.profile || {}
    return <ProfileView.Wrap>
      {!url
        ? <Elems.Icon url={url} icon="alicorn" style={Actheme.style('c:pink fs:s25 mb:s10')} />
        : <ProfileEdit.Image source={url} />
      }
      <ProfileView.Text>
        {desc || `A Unicorn is a mythical creature, someone amazing who is hard to catch or simply a very rare find.
        <br/><br/>
        The term is often describing someone who is remarkably attractive, but not at all batshit crazy, amazing at sex, and has a great personality.`}
      </ProfileView.Text>
      <ProfileView.Text pink>You may be a Unicorn!</ProfileView.Text>
    </ProfileView.Wrap>
  }

})

const ProfileEdit = Actheme.create({

  Wrap: ['View', 'fd:col w:100% xw:s100', {
    row: 'fd:row jc:sb'
  }],
  File: 'Upload',
  Input: ['TextInput', ['c:black fs:s4 mb:s5 p:s5 bw:1 bc:black50 bg:white200 br:s5', { multiline: true, numberOfLines: 4 }], {
    active: 'bc:green'
  }],
  Text: ['Text', 'c:pink w:100% fs:s4 fb:bold', {
    orange: 'c:orange',
    center: 'ta:c'
  }],
  Touch: ['TouchableOpacity', 'w:100% xw,h:s100 jc,ai:c bw:1 bc:black50 bg:white200 br:s5 of:hd mb:s5'],
  Image: ['Image', 'w:100% xw,h:s100 bw:1 bc:black100 br:s5 of:hd mb:s5 bg:white200'],

  Comp: props => {

    const { action, act } = Actstore({}, [])
    const [active, setActive] = React.useState()
    const [desc, setDesc] = React.useState()
    const [url, setUrl] = React.useState()

    return <ProfileEdit.Wrap>
      <ProfileEdit.File action={files => act('APP_UPLOAD', files).then(setUrl)}>
        {!url
          ? <ProfileEdit.Touch>
              <Elems.Icon style={Actheme.style('c:pink fs:s20 mb:s5')} icon="plus-circle"/>
              <ProfileEdit.Text center>Upload Unique Avatar or Logo</ProfileEdit.Text>
            </ProfileEdit.Touch>
          : <ProfileEdit.Image source={url} />}
      </ProfileEdit.File>
      {url && <ProfileEdit.Input
        onChangeText={setDesc}
        placeholder={"Tell everyone about your uniqueness"}
        active={active}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)} />}
      {url && desc && <Elems.Button disabled={!Boolean(desc) || !Boolean(url)} onPress={() => act('APP_USER', { url, desc }).then(props.onClose)} text="Are you ready to update?" post />}
    </ProfileEdit.Wrap>
  }

})

const Post = Actheme.create({

  Touch: ['TouchableOpacity', 'w:100% xw,h:s80 jc,ai:c bw:1 bc:black50 br:s5 of:hd m:s5 bg:white200', { md: 'xw,h:s100' }],
  Image: ['Image', 'w,h:100%'],

  Comp: ({post, ...props}) => {
    const { handle } = Actstore({}, [])
    const router = handle.useRouter()

    //() => router.push('profile/' + post.userId)
    return <Post.Touch {...props} 
      // onPress={() => router.push('profile/' + post.userId)}
      onPress={() => router.push('post/' + post.id)}
    >
      <Post.Image source={post.url} />
    </Post.Touch>
  }

})
