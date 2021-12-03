import React from 'react'
import Elems from '../../elems'
import { Actheme } from '../../theme'
import Actstore from 'actstore'

const Nav = Actheme.create({

  Container: ['View', 'w:100% jc,ai:c z:2 mv:s10'],
  Wrap: ['View', 'jc,ai:c', {
    image: 'w,h,br:s25 bg:white of:hd mh:s7 mt:s5 mb:s2',
    row: 'fd:row',
    input: 'ps:ab z:2',
    search: 'ps:ab l:-s2',
  }],
  Image: ['Image', 'w,h:100%'],
  Input: ['TextInput', ['c:black fs:s4 p:s2 pl:s10 pr:s5 bw:1 bc:black50 bg:white br:s5 ta:c w:s70', { multiline: false, numberOfLines: 1 }], {
    focus: 'bc:green'
  }],

  Comp: (props) => {
    const { store, action, handle } = Actstore({}, ['user', 'posts'])
    const router = handle.useRouter()
    const { user, users } = store.get('user', 'users')
    const { id } = router?.query || {}
    const [focus, setFocus] = React.useState()
    const [active, setActive] = React.useState()
    const profile = users?.find(item => item.id === id) || { url: !!id ? "https://c.tenor.com/xD2H2paGBt4AAAAC/prizzzle-unicorn.gif" : 'https://cdn.dribbble.com/users/61660/screenshots/4409254/unicorn_03.gif', desc: !!id ? id : 'unicorn' }
    const path = typeof window !== "undefined" && window.location.pathname

    return <Nav.Container>
      <Nav.Wrap row>
        {user && <Elems.Button icon="search" iconSize="s5" onPress={() => setActive(true)} /> }
        {(!user || active) && <Nav.Wrap input={user}>
          <Nav.Wrap search>
            { !user && <Elems.Button icon="search" iconColor="grey" />}
            { user && <Elems.Button icon="times-circle" iconColor="grey" iconSize="s5" onPress={() => setActive(false)} /> }
          </Nav.Wrap>
          <Nav.Input
            placeholder={path !== '/' ? `Search @${profile.desc} content` : 'Search unicorns'}
            focus={focus}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}  />
          </Nav.Wrap>
        }
        {user && <Elems.Button icon="home" iconSize="s5" onPress={() => router?.push('/')} />}
        {user && id !== user.id && <Elems.Button icon="user-circle" iconSize="s5" onPress={() => router.push('/profile/' + user.id)} />}
        {user && id === user.id && <Elems.Button icon="power-off" iconSize="s5"  onPress={action('APP_LOGOUT')} />}
      </Nav.Wrap>
      <Nav.Wrap row>
        {!user && path === '/'
          ? <Elems.Button text="Login" onPress={action('APP_LOGIN')} />
          : path === '/' || user && id === user.id 
            ? <Elems.Button
                text={props.mode === 'post' ? 'Back' : 'Upload'}
                textColor={props.mode === 'post' ? 'red' : 'green'}
                onPress={props.mode === 'post' ? () => props.setMode() : () => props.setMode('post')} />
            : <Elems.Button text="Back" textColor="red" onPress={() => router.push('/')} />
        }
        <Nav.Wrap image>
          <Nav.Image source={profile.url} />
        </Nav.Wrap>
        <Elems.Button text="About" />
      </Nav.Wrap>
      <Elems.Button text={'@' + profile.desc} />
    </Nav.Container>
  }

})



export default Nav.Comp
