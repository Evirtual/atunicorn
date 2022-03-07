import React, { useState, useEffect } from 'react'
import Elems from '../../elems'
import Layout from '../..'
import { Actheme } from '../../theme'
import Actstore from 'actstore'

const Login = Actheme.create({

  Wrap: 'View',
  Content: ['View', 'bg:white br:s5 w:100% nh,xw:s100 ai,jc:c bw:1 bc:black50 p:s5'],
  Text: ['Text', 'fs:s4 ta:c mb:s2'],
  Input: ['TextInput', ['c:black fs:s4 pv:s2 ph:s10 bw:1 bc:black50 bg:white br:s5 ta:c w:s70', { multiline: false, numberOfLines: 1 }], {
    focus: 'bc:mediumseagreen',
    space: 'mb:s3'
  }],
  Close: ['View', 'w,h,br:s8 of:hd ps:ab t,r:s2 z:3 bg:black200 ai,jc:c'],
  Image: 'Image',

  Comp: (props) => {
    const { act, action } = Actstore({}, [])
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [disabled, setDisabled] = useState(true)
    const [login, setLogin] = useState()
    const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/

    useEffect(() => {(email && password) ? setDisabled(false) : setDisabled(true)}, [email, password])

    return (
      <Login.Wrap style={Actheme.style('display:flex justifyContent:center alignItems:center ps:fixed l,r,t,b:0 z:99 bg:black300 p:s5')}>
        <Login.Content>
          <Login.Close>
            <Elems.Button icon="times-circle" iconSize="s8" color="white" onPress={props.onClose} />
          </Login.Close>
          <Login.Wrap style={Actheme.style('mb:auto mt:s5')}>
            <Login.Text space>Welcome to @unicorn</Login.Text>
            <Login.Text>{!login ? 'Please login to you account' : 'We hope you will enjoy your stay'}</Login.Text>
          </Login.Wrap>
          {/* <Elems.Button
            google
            inline
            source="/static/google.png" imageWidth="s6" imageHeight="s6"
            text="Sign in with Google" onPress={action('APP_LOGIN_GOOGLE')} />
          <Login.Text>or</Login.Text> */}
          <Elems.Input
            placeholder={'Enter your email address'}
            space
            onChangeText={setEmail}/>
          <Elems.Input
            password
            placeholder={'Enter your password'}
            onChangeText={setPassword} />
          <Elems.Button
            disabled={disabled}
            submit
            onPress={() => {
              act(!login ? 'APP_LOGIN_EMAIL_PASSWORD' : 'APP_SIGNUP_EMAIL_PASSWORD', email, password)
                .then(() => email.match(regexEmail) && password.match(regexPassword) && setLogin(false))
            }}
            text={!login ? 'Login @unicorn' : 'join @unicorn'}
            style={Actheme.style('w:s70')} />
          <Elems.Button
            text={!login ? 'Signup @unicorn' : 'login'}
            style={Actheme.style(`w:s70 mt:auto mb:s1 c:${!login ? 'lightsalmon' : 'black'}`)}
            onPress={() => !login ? setLogin(true) : setLogin(false) } />
        </Login.Content>
      </Login.Wrap>
    )
  }

})

export default Login.Comp