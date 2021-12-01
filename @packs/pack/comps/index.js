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
    const profile = users?.find(item => item.id === id) || { url: !!id ? "https://c.tenor.com/xD2H2paGBt4AAAAC/prizzzle-unicorn.gif" : 'https://cdn.dribbble.com/users/61660/screenshots/4409254/unicorn_03.gif', desc: !!id ? id : 'unicorn' }
    
    return <Styled.Container>
      <Styled.Wrap row>
        {user &&  <Elems.Button icon="user-circle" iconSize="s5" onPress={() => router.push('/profile/' + user.id)} />}
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
          <Styled.Image source={profile.url} />
        </Styled.Wrap>
        <Elems.Button text="Search" />
      </Styled.Wrap>
      <Elems.Button text={'@' + profile.desc} />
    </Styled.Container>
  }

})

export default {
	Nav: Styled.Comp
}
