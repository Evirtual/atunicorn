import React from 'react'
import Elems from '../elems'
import { Actheme } from '../theme'
import Actstore from 'actstore'

const Logo = Actheme.create({

  Container: ['View', 'w:100% jc,ai:c z:2 mv:s10'],
  Wrap: ['View', 'w:100% jc,ai:c fd:row'],
  Logout: ['View', ''],
  Inner: ['View', 'jc,ai:c fd:row'],
  Content: ['View', 'w,h,br:s25 bg:white jc,ai:c of:hd mh:s8 mv:s5'],
  Image: ['Image', 'w,h:s20'],

  Comp: (props) => {
    const { store, action, handle } = Actstore({}, ['user', 'posts'])
    const { user } = store.get('user', 'users')
    
    return <Logo.Container>
      {user && 
        <Logo.Logout>
          <Elems.Button icon="power-off" iconSize="s5" color="purple"  onPress={action('APP_LOGOUT')} />
        </Logo.Logout>
      }
      <Logo.Inner>
        {!user
          ? <Elems.Button text="Login" onPress={action('APP_LOGIN')} />
          : <Elems.Button
            
              text={props.mode === 'post' ? 'Back' : 'Upload'}
              textColor={props.mode === 'post' ? 'red' : 'green'}
              onPress={props.mode === 'post' ? () => props.setMode() : () => props.setMode('post')} />
        }
        <Logo.Content>
          <Logo.Image source={props.id && user && user.photo || "https://www.gmcrafts.co.uk/wp-content/uploads/2018/11/Cute-Unicorn-Main-Product-Image.jpg"} />
        </Logo.Content>
        <Elems.Button text="Search" />
      </Logo.Inner>
      <Elems.Button text={props.desc || props.id && user && user.name || "@unicorn"} onPress={props.onPress} />
    </Logo.Container>
  }

})

export default {
	Logo: Logo.Comp
}
