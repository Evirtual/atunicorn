import React from 'react'
import Elems from '../elems'
import { Actheme } from '../theme'
import Actstore from 'actstore'

const Logo = Actheme.create({

  Wrap: ['View', 'w:100% jc,ai:c fd:row z:2 pb:s10 mb:auto'],
  Inner: ['View', 'jc,ai:c'],
  Content: ['View', 'w,h,br:s25 bg:white jc,ai:c of:hd mh:s10 mt:s10 mb:s2'],
  Image: ['Image', 'w,h:s20'],
  Title: ['Text', 'ta:c fs:s5 mt:s2'],

  Comp: (props) => {
    const { store, action } = Actstore({}, ['user', 'posts'])
    const { user } = store.get('user', 'users')
    return <Logo.Wrap>
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
        <Elems.Button text={props.desc || user && user.name || "UNICORN"} onPress={props.onPress} />
      </Logo.Inner>
      <Elems.Button text="Search" />
    </Logo.Wrap>
  }

})

export default {
	Logo: Logo.Comp
}
