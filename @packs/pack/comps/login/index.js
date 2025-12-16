import React, { useState, useEffect } from 'react'
import { Actheme } from '../../theme'
import Elems from '../../elems'
import Placeholder from '../placeholder'
import Actstore from 'pack/store/actstore'

const Login = Actheme.create({

  Wrap: ['View', 'w:100% ai,jc:c', {
    max: 'xw:s70',
    placeholder: 'ps:ab h:100%',
    space: 'mt:s3'
  }],
  Container: ['View', 'ai,jc:c ps:fixed l,r,t,b:0 z:99 bg:black300 p:s5'],
  Content: ['View', 'bg:grey br:s5 w:90vw nh,xw:s95 ai,jc:c bw:1 bc:grey p:s3'],
  Text: ['Text', 'fs:s4 c:black400 ta:c mb:s2 fb:500'],
  Close: ['View', 'ps:ab t,r:s1.5 ai,jc:c z:3'],
  Image: 'Image',

  Comp: (props) => {
    const { act } = Actstore({}, [])
    const regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordVisible, setPasswordVisible] = useState()
    const [disabled, setDisabled] = useState(true)
    const [login, setLogin] = useState(true)
    const [logging, setLogging] = useState()
    const [created, setCreated] = useState()

    useEffect(() => {
      (email && password)
        ? setDisabled(false)
        : setDisabled(true)
    }, [email, password])

    const loginRegister = () => (
      setLogging(true), 
      setTimeout(() => 
        act(login ? 'APP_LOGIN_EMAIL_PASSWORD' : 'APP_SIGNUP_EMAIL_PASSWORD', email, password)
          .then((error) => 
            error
              ? (setLogging(false))
              : !login
                ? (setLogging(false), setLogin(false), setCreated(true))
                : (setLogging(false), (error == false) && setCreated(true))
          )
          .then(() => (email.match(regexEmail) && password.match(regexPassword )))
      ,2000)
    )

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
            <Login.Text>Welcome @unicorn</Login.Text>
            <Login.Text>{login ? 'Please login to you account' : 'We hope you will enjoy your stay'}</Login.Text>
          </Login.Wrap>
          <Login.Wrap max>
            <Elems.Input
              placeholder={'Enter your email address'}
              onChangeText={setEmail}/>
            <Login.Wrap space>
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
              onPress={!logging && loginRegister}
              text={login ? 'Login @unicorn' : 'join @unicorn'}
              style={Actheme.style('w:100% mt:s4')
            } />
            {login && 
              <Elems.Button
                onPress={() => {act('APP_RESET_PASSWORD', email)}}
                text="Forgot password? Enter email and press here"
                textColor="black300"
                fontSize="s3"
                style={Actheme.style('w:100%')} />
            }
          </Login.Wrap>
          <Elems.Button
            text={login ? 'Signup @unicorn' : 'Login'}
            textColor="lightsalmon"
            style={Actheme.style('mt:auto')}
            onPress={() => login ? setLogin(false) : setLogin(true) } />
          {created &&
            <Login.Wrap placeholder>
              <Placeholder
                login
                logo
                title={'Account created'}
                desc={'We\'ve sent you verification email\nPlease verify and login'}
                actionText="Login"
                action={() => (setCreated(false), setLogin(true))} />
            </Login.Wrap>
          }
          {logging && 
            <Login.Wrap placeholder>
              <Placeholder login logo title={login ? 'Connecting' : 'Creating profile'} />
            </Login.Wrap>
          }
        </Login.Content>
      </Login.Container>
    )
  }

})

export default Login.Comp