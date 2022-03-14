import React, { useState, useEffect } from 'react'
import Elems from '../../elems'
import { Actheme } from '../../theme'
import Actstore from 'actstore'

const Login = Actheme.create({

  Wrap: 'View',
  Container: ['View', 'ai,jc:c ps:fixed l,r,t,b:0 z:99 bg:black300 p:s5'],
  Content: ['View', 'bg:white br:s5 w:100% nh,xw:s90 ai,jc:c bw:1 bc:black50 p:s4'],
  Text: ['Text', 'fs:s4 ta:c mb:s2'],
  Close: ['View', 'w,h,br:s8 bg:black200 ps:ab t,r:s2 ai,jc:c z:3'],
  Image: 'Image',

  Comp: (props) => {
    const { act } = Actstore({}, [])
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordVisible, setPasswordVisible] = useState()
    const [disabled, setDisabled] = useState(true)
    const [login, setLogin] = useState()
    const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/

    useEffect(() => {(email && password) ? setDisabled(false) : setDisabled(true)}, [email, password])

    return (
      <Login.Container>
        <Login.Content>
          <Login.Close>
            <Elems.Button
              remove 
              icon="times" 
              iconSize="s5" 
              color="white" 
              onPress={props.onClose} />
          </Login.Close>
          <Login.Wrap style={Actheme.style('mt:s5 mb:s8')}>
            <Login.Text space>Welcome to @unicorn</Login.Text>
            <Login.Text>{!login ? 'Please login to you account' : 'We hope you will enjoy your stay'}</Login.Text>
          </Login.Wrap>
          <Login.Wrap>
            <Elems.Input
              placeholder={'Enter your email address'}
              space
              onChangeText={setEmail}/>
            <Login.Wrap>
              <Elems.Input
                password={passwordVisible ? false : true}
                placeholder={'Enter your password'}
                onChangeText={setPassword} />
              <Elems.Button
                icon={passwordVisible ? 'eye' : 'eye-slash'}
                onPress={() => {setPasswordVisible(!passwordVisible)}}
                style={Actheme.style('ps:ab r:s2')} />
            </Login.Wrap>
            <Elems.Button
              disabled={disabled}
              submit
              onPress={() => {
                act(!login ? 'APP_LOGIN_EMAIL_PASSWORD' : 'APP_SIGNUP_EMAIL_PASSWORD', email, password)
                  .then(() => email.match(regexEmail) && password.match(regexPassword) && setLogin(false))
              }}
              text={!login ? 'Login @unicorn' : 'join @unicorn'}
              style={Actheme.style('w:s70')} />
            {!login && <Elems.Button
              onPress={() => {act('APP_RESET_PASSWORD', email)}}
              text="Forgot password? Enter email and press here"
              style={Actheme.style('w:s70 c:grey fs:s3')} />}
          </Login.Wrap>
          <Elems.Button
            text={!login ? 'Signup @unicorn' : 'Login'}
            style={Actheme.style('w:s70 c:lightsalmon mt:auto mb:s1')}
            onPress={() => !login ? setLogin(true) : setLogin(false) } />
        </Login.Content>
      </Login.Container>
    )
  }

})

export default Login.Comp