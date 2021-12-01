import React from 'react'
import Elems from '../elems'
import { Actheme } from '../theme'
import Actstore from 'actstore'

const Styled = Actheme.create({

  Container: ['View', 'w:100% jc,ai:c z:2 mv:s10'],
  Logout: ['View', ''],
  Wrap: ['View', 'jc,ai:c', {
    image: 'w,h,br:s25 bg:white of:hd mh:s10 mv:s5',
    row: 'fd:row'
  }],
  Image: ['Image', 'w,h:100%'],

  Comp: (props) => {
    const { store, action, handle } = Actstore({}, ['user', 'posts'])
    const router = handle.useRouter()
    const { user, users } = store.get('user', 'users')
    const { id } = router?.query || {}
    const profile = users?.find(item => item.id === user.id)
    
    return <Styled.Container>
      <Styled.Wrap row>
        <Elems.Button icon="user-circle" iconSize="s5" onPress={() => router.push('/' + user.id)} />
        <Elems.Button icon="home" iconSize="s5" onPress={() => router?.push('/')} />
        {user && <Elems.Button icon="power-off" iconSize="s5" color="purple"  onPress={action('APP_LOGOUT')} />}
      </Styled.Wrap>
      <Styled.Wrap row>
        {!user
          ? <Elems.Button text="Login" onPress={action('APP_LOGIN')} />
          : <Elems.Button
              text={props.mode === 'post' ? 'Back' : 'Upload'}
              textColor={props.mode === 'post' ? 'red' : 'green'}
              onPress={props.mode === 'post' ? () => props.setMode() : () => props.setMode('post')} />
        }
        <Styled.Wrap image>
          <Styled.Image source={id && user && profile.url || "https://cdn.dribbble.com/users/61660/screenshots/4409254/unicorn_03.gif"} />
          {/* <Styled.Image source={id && user && profile.url || "https://c.tenor.com/xD2H2paGBt4AAAAC/prizzzle-unicorn.gif"} /> */}
          {/* <Styled.Image source={props.id && user && props.profile.url || "https://cur.glitter-graphics.net/pub/3709/3709367wye5xujeqk.gif"} /> */}
          {/* <Styled.Image source={props.id && user && props.profile.url || "https://jeffdarchuk.files.wordpress.com/2019/12/unicornn.gif"} />
          <Styled.Image source={props.id && user && props.profile.url || "https://cdn.dribbble.com/users/2255934/screenshots/6222338/uni.gif"} />
          <Styled.Image source={props.id && user && props.profile.url || "https://c.tenor.com/MpvS2TCmTi8AAAAC/unicorn-dab.gif"} /> */}
        </Styled.Wrap>
        <Elems.Button text="Search" />
      </Styled.Wrap>
      <Elems.Button text={id && user && '@' +  profile.desc || "@unicorn"} onPress={() => router.push(id ? '/' : '/' + user.id)} />
    </Styled.Container>
  }

})

export default {
	Nav: Styled.Comp
}
