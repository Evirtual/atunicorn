import React, { useState, useEffect } from 'react'
import { Actheme } from '../../theme'
import Elems from '../../elems'
import Comps from '../../comps'
import Actstore from 'actstore'

const Login = Actheme.create({

  Wrap: ['View', 'w:100% ai,jc:c', {
    max: 'xw:s70'
  }],
  Container: ['View', 'ai,jc:c ps:fixed l,r,t,b:0 z:99 bg:black300 p:s3'],
  Content: ['View', 'bg:grey br:s5 w:100% nh,xw:s92 ai,jc:c bw:1 bc:black50 p:s4'],
  Text: ['Text', 'fs:s4 ta:c mb:s2'],
  Close: ['View', 'ps:ab t,r:s2 ai,jc:c z:3'],
  Image: 'Image',

  Comp: (props) => {
    const { act } = Actstore({}, [])
    const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordVisible, setPasswordVisible] = useState()
    const [disabled, setDisabled] = useState(true)
    const [login, setLogin] = useState()
    const [logging, setLogging] = useState()
    const [created, setCreated] = useState()

    useEffect(() => {
      (email && password)
        ? setDisabled(false)
        : setDisabled(true)
    }, [email, password])

    return (
      <Login.Container>
        <Login.Content>
          <Login.Close>
            <Elems.Button
              option
              close
              icon="times"
              onPress={props.onClose} />
          </Login.Close>
          <Login.Wrap style={Actheme.style('mt:s5 mb:s8')}>
            <Login.Text space>Welcome to @unicorn</Login.Text>
            <Login.Text>{!login ? 'Please login to you account' : 'We hope you will enjoy your stay'}</Login.Text>
          </Login.Wrap>
          <Login.Wrap max>
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
                style={Actheme.style('ps:ab r:0')} />
            </Login.Wrap>
            <Elems.Button
              disabled={disabled}
              submit
              onPress={() => 
                !logging
                  ? (
                      setLogging(true), 
                      setTimeout(() => 
                        act(!login ? 'APP_LOGIN_EMAIL_PASSWORD' : 'APP_SIGNUP_EMAIL_PASSWORD', email, password)
                          .then((error) => (console.log(error), error ? setLogging(false) : (setLogging(false), setLogin(false), setCreated(true))))
                          .then(() => (email.match(regexEmail) && password.match(regexPassword )))
                      ,2000)
                    )
                  : null
              }
              text={!login ? 'Login @unicorn' : 'join @unicorn'}
              style={Actheme.style('w:100%')
            } />
            {!login && 
              <Elems.Button
                onPress={() => {act('APP_RESET_PASSWORD', email)}}
                text="Forgot password? Enter email and press here"
                textColor="black300"
                fontSize="s3"
                style={Actheme.style('w:100%')} />
            }
          </Login.Wrap>
          <Elems.Button
            text={!login ? 'Signup @unicorn' : 'Login'}
            textColor="lightsalmon"
            style={Actheme.style('mt:auto')}
            onPress={() => !login ? setLogin(true) : setLogin(false) } />
          {created &&
            <Comps.Placeholder
              modal
              logo
              actiontext="Login"
              action={() => setCreated(false)}
              title={'Account created'}
              desc={'We\'ve sent you verification email.\nPlease verify and login'} />}
          {logging && <Comps.Placeholder modal logo title={login ? 'Creating profile' : 'Connecting'} />}
        </Login.Content>
      </Login.Container>
    )
  }

})

export default Login.Comp