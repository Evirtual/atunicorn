import React from 'react'
import Elems from '../../elems'
import { Actheme } from '../../theme'
import Actstore from 'actstore'

const Login = Actheme.create({

  Wrap: 'View',
  Content: ['View', 'bg:white br:s5 w:100% nh,xw:s100 ai,jc:c bw:1 bc:black50'],
  Text: ['Text', 'fs:s4 ta:c mv:s2'],
  Input: ['TextInput', ['c:black fs:s4 p:s2 pl:s10 pr:s10 bw:1 bc:black50 bg:white br:s5 ta:c w:s70', { multiline: false, numberOfLines: 1 }], {
    focus: 'bc:mediumseagreen'
  }],
  Close: ['View', 'w,h,br:s8 of:hd ps:ab t,r:s2 z:3 bg:black200 ai,jc:c'],
  Image: 'Image',

  Comp: (props) => {
    const { act, action } = Actstore({}, [])
    const [focus, setFocus] = React.useState()
    const [email, setEmail] = React.useState()
    const [auth, setAuth] = React.useState()
    const regexp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return <Login.Wrap style={Actheme.style('display:flex justifyContent:center alignItems:center ps:fixed l,r,t,b:0 z:99 bg:black300 p:s5')}>
      <Login.Content>
        <Login.Close>
          <Elems.Button icon="times-circle" iconSize="s8" color="white" onPress={props.onClose} />
        </Login.Close>
        <Login.Text>welcome to @unicorn</Login.Text>
        <Login.Text>we hope you will enjoy the stay</Login.Text>
        {!auth && <>
          <Elems.Button google inline source="/static/google.png" imageWidth="s6" imageHeight="s6" text="Sign in with Google" onPress={action('APP_LOGIN_GOOGLE')} />
          <Login.Text>or</Login.Text>
          <Login.Input
            placeholder={'enter email address'}
            focus={focus}
            onChangeText={setEmail}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)} />
          <Elems.Button
            disabled={!email}
            post
            onPress={() => {
              act('APP_LOGIN', email).then(() => setAuth(email.match(regexp) && true))
            }}
            text="join @unicorn"
            textColor="white"
            style={Actheme.style('w:s70')} />
        </>}
        {auth && <>
          <Login.Image style={Actheme.style('w,h:s50')} source={'/static/unicorn-io.gif'} />
          <Login.Text>authenticating...</Login.Text>
          <Login.Text>please check your email and confirm</Login.Text>
          <Login.Text>(check spam folder as well)</Login.Text>
        </>}
      </Login.Content>
    </Login.Wrap>
  }

})


export default Login.Comp