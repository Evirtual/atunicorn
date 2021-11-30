import React from 'react'
import Elems from '../elems'
import { Actheme } from '../theme'
import Actstore from 'actstore'

const Logo = Actheme.create({

  Container: ['View', 'w:100% jc,ai:c fd:row z:2 mb:s10'],
  Wrap: ['View', 'w:100% jc,ai:c fd:row'],
  Logout: ['View', 'mr:s2'],
  Inner: ['View', 'jc,ai:c'],
  Content: ['View', 'w,h,br:s25 bg:white jc,ai:c of:hd mh:s10 mt:s10 mb:s2'],
  Image: ['Image', 'w,h:s20'],
  Title: ['Text', 'ta:c fs:s5 mt:s2'],

  Comp: (props) => {
    const { store, action, handle } = Actstore({}, ['user', 'posts'])
    const { user } = store.get('user', 'users')
    const router = handle.useRouter()
    const { id } = router?.query || {}
    
    return <Logo.Container>
       {!user
          ? <Elems.Button text="Login" onPress={action('APP_LOGIN')} />
          : <Elems.Button
              text={props.mode === 'post' ? 'Cancel' : 'Upload'}
              textColor={props.mode === 'post' ? 'red' : 'green'}
              onPress={props.mode === 'post' ? () => props.setMode() : () => props.setMode('post')} />
        }
      <Logo.Inner>
        <Logo.Content>
          <Logo.Image source={user && user.photo || "https://www.gmcrafts.co.uk/wp-content/uploads/2018/11/Cute-Unicorn-Main-Product-Image.jpg"} />
        </Logo.Content>
        <Logo.Wrap>
          {user && 
            <Logo.Logout>
              <Elems.Button icon="power-off" iconSize="s5" color="grey" onPress={action('APP_LOGOUT')} />
            </Logo.Logout>
          }
          <Elems.Button text={props.desc || user && user.name || "UNICORN"} onPress={props.onPress} />
        </Logo.Wrap>
      </Logo.Inner>
      <Elems.Button text="Search" />
    </Logo.Container>
  }

})

export default {
	Logo: Logo.Comp
}
