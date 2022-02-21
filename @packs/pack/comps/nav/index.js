import React from 'react'
import Elems from '../../elems'
import { Actheme } from '../../theme'
import Actstore from 'actstore'

const Nav = Actheme.create({

  Container: ['View', 'w:100% jc,ai:c z:2 mv:s10'],
  Wrap: ['View', 'jc,ai:c', {
    image: 'w,h,br:s25 bg:white of:hd mh:s7 mt:s5 mb:s3',
    row: 'fd:row',
    input: 'ps:ab z:2',
    search: 'ps:ab l:-s2',
    save: 'ps:ab r:-s2',
  }],
  Image: ['Image', 'w,h:100%'],
  Input: ['TextInput', ['c:black fs:s4 p:s2 pl:s10 pr:s10 bw:1 bc:black50 bg:white br:s5 ta:c w:s70', { multiline: false, numberOfLines: 1 }], {
    focus: 'bc:mediumseagreen'
  }],
  File: 'Upload',
  Touch: ['TouchableOpacity', 'w,h,br:s25 jc,ai:c bg:white200 br:s5 of:hd'],
  Image: ['Image', 'w,h:s25'],

  Comp: (props) => {
    const { act, store, action, handle } = Actstore({}, ['user', 'posts', 'uploading'])
    const router = handle.useRouter()
    const { user, users, uploading } = store.get('user', 'users', 'uploading')
    const { id } = router?.query || {}
    const [focus, setFocus] = React.useState()
    const [active, setActive] = React.useState()
    const [editUsername, setEditUsername] = React.useState()
    const [username, setUsername] = React.useState()
    const [login, setLogin] = React.useState()
    const profile = users?.find(item => item.id === id) || {}
    const path = typeof window !== "undefined" && window.location.pathname

    return (
      <>
        {login && <Login.Comp onClose={() => setLogin(!login)} />}
        <Nav.Container>
          <Nav.Wrap row>
            {user && <Elems.Button icon="search" iconSize="s5" onPress={() => setActive(true)} /> }
            {(!user || active) && <Nav.Wrap input={user}>
              <Nav.Wrap search>
                { !user 
                  ? <Elems.Button icon="search" iconColor="grey" />
                  : <Elems.Button icon="times-circle" iconColor="grey" iconSize="s5" onPress={() => setActive(false)} /> 
                }
              </Nav.Wrap>
              <Nav.Input
                placeholder={path !== '/' && path !== '/about' && !!profile.id ? `Search @${profile?.username || id}` : 'Search @unicorn'}
                focus={focus}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}  />
              {!user && path !== '/' && <Nav.Wrap save>
                <Elems.Button icon="home" iconColor="grey" onPress={() => router?.push('/')} />
              </Nav.Wrap>}
            </Nav.Wrap>
            }
            {user && <Elems.Button icon="home" iconSize="s5" onPress={() => router?.push('/')} />}
            {user && id !== user.id 
              ? <Elems.Button icon="user-circle" iconSize="s5" onPress={() => router.push('/profile/' + user.id)} />
              : user && <Elems.Button icon="power-off" iconSize="s5"  onPress={action('APP_LOGOUT')} />
            }
          </Nav.Wrap>
          <Nav.Wrap row>
            {!user && path === '/'
              ? <Elems.Button text="login" onPress={() => setLogin(!login)} />
              : path === '/' || user && id === user.id && (path !== '/profile/' + user.id + '/about')
                ? <Elems.Button
                    disabled={!user.approved}
                    text={props.mode === 'post' ? 'back' : 'upload'}
                    textColor={props.mode === 'post' ? 'black' : 'mediumseagreen'}
                    onPress={props.mode === 'post' ? () => props.setMode() : () => props.setMode('post')} />
                :  <Elems.Button text="back" textColor="black" onPress={() => router.back()} />
            }
            <Nav.Wrap image>
              {user && id === user.id
                ? <Nav.File action={files => act('APP_UPLOAD', files, 'profile').then(url => act('APP_USER', { url }))}>
                    <Nav.Touch>
                      {uploading == 'profile'
                          ? <Elems.Button icon="atom-alt" style={Actheme.style('fs:s14 c:gainsboro')} spin />
                          : !profile.url
                            ? <Elems.Icon style={Actheme.style('c:grey fs:s10')} icon="camera" solid />
                            : <Nav.Image source={profile.url} />
                      }
                    </Nav.Touch>
                  </Nav.File>
                : path !== '/' && path !== '/about/' && !profile.url
                  ? <Elems.Icon style={Actheme.style('c:black100 fs:s20')} icon="user-circle" solid />
                  : <Nav.Image source={profile.url ? profile.url : '/static/unicorn-io.gif' } />
              }
            </Nav.Wrap>
            <Elems.Button
              text="about"
              onPress={
                path === '/'
                  ? () => router.push('/about/')
                  : path === '/about/'
                    ? null
                    : () => router.push('/profile/' + id + '/about/')
              } />
          </Nav.Wrap>
          <Nav.Wrap row>
            {!editUsername && <Elems.Button text={'@' + (profile.username ? profile.username : id ? id : 'unicorn')} onPress={ user && id === user.id ? () => setEditUsername(true) : null} /> }
            {user && id === user.id && editUsername && <Nav.Wrap row>
              <Nav.Wrap search>
                <Elems.Button icon="times-circle" iconColor="grey" iconSize="s5" onPress={() => setEditUsername(false)} />
              </Nav.Wrap>
              <Nav.Input
                defaultValue={profile.username || ''}
                onChangeText={setUsername}
                placeholder={profile.username || "set username"}
                focus={focus}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)} />  
              <Nav.Wrap save>
                <Elems.Button icon="save" iconColor="mediumseagreen" iconSize="s5" onPress={() => act('APP_USER', { username }).then(() => setEditUsername(false))} />
              </Nav.Wrap>
            </Nav.Wrap>}
            {user && id === user.id && !editUsername && !profile.username && path !== '/' && <Elems.Button icon="pencil" iconSize="s5" onPress={() => setEditUsername(true)} />}
          </Nav.Wrap>
        </Nav.Container>
      </>
    )
  }
})

export default Nav.Comp

const Login = Actheme.create({

  Wrap: 'View',
  Content: ['View', 'bg:white br:s5 w:100% nh,xw:s100 ai,jc:c bw:1 bc:black50'],
  Text: ['Text', 'fs:s4 ta:c mb:s5'],
  Input: ['TextInput', ['c:black fs:s4 p:s2 pl:s10 pr:s10 bw:1 bc:black50 bg:white br:s5 ta:c w:s70 mt:s5', { multiline: false, numberOfLines: 1 }], {
    focus: 'bc:mediumseagreen'
  }],
  Close: ['View', 'w,h,br:s8 of:hd ps:ab t,r:s2 z:3 bg:black200 ai,jc:c'],
  Image: 'Image',

  Comp: (props) => {

    const [focus, setFocus] = React.useState()
    const [email, setEmail] = React.useState()
    const [auth, setAuth] = React.useState()

    return <Login.Wrap style={Actheme.style('display:flex justify-content:center align-items:center ps:ab l,r,t,b:0 z:99 bg:black300 p:s5')}>
      <Login.Content>
        <Login.Close>
          <Elems.Button icon="times-circle" iconSize="s8" color="white" onPress={props.onClose} />
        </Login.Close>
        <Login.Text>welcome to @unicorn</Login.Text>
        <Login.Text>we hope you will enjoy the stay</Login.Text>
        {!auth && <>
          <Login.Input
          placeholder={'enter email address'}
          focus={focus}
          onChangeText={setEmail}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}  />
          <Elems.Button
            disabled={!email}
            post
            onPress={setAuth}
            text="join @unicorn"
            textColor="white"
            style={Actheme.style('w:s70')} />
        </>}
        {auth && <>
          <Login.Image style={Actheme.style('w,h:s50')} source={'/static/unicorn-io.gif'} />
          <Login.Text>authenticating...</Login.Text>
        </>}
      </Login.Content>
    </Login.Wrap>
  }

})