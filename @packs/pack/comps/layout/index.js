import React, { useEffect } from 'react'
import { Actheme } from '../../theme'
import Elems from '../../elems'
import { useStore } from 'pack/store'

const Info = Actheme.create({

  Touch: ['TouchableOpacity', 'jc,ai:ctr pv:s3 bg:salmon z:1 pl:s5 pr:s15 pos:fixed b,r:0 m:s5 br:s5 xw:s95', {
    update: 'bg:skyblue',
    success: 'bg:lightgreen',
    error: 'bg:salmon' }],
  Text: ['Text', 'c:black fwt:500 fs:s4'],
  Close: ['View', 'pos:ab t,r:s1.25 z:3 ai,jc:ctr'],

  Comp: (props) => {

  const {message = 'Something went wrong'} = props
    
  const { store } = useStore()
    const { error, success, user, ready } = store.get('error', 'success', 'user', 'ready')

    useEffect(() => {
      success && store.set({ error: null })

      const removeNotification = setTimeout(() => {
        store.set({ success: null })
      }, 2500)

      return () => clearTimeout(removeNotification)
    }, [success])

    useEffect(() => {
      error && store.set({ success: null })
    }, [error])

    return <>
      {!ready && <Loader.Comp />}
      {user && !user.approved && <Info.Touch update>
        <Info.Text>Account is pending for approval.</Info.Text>
      </Info.Touch>}
      {(error || (success && success?.type !== 'register')) && 
        <Info.Touch 
          success={success}
          onPress={() => store.set({ error: null, success: null })}>
          <Info.Close>
            <Elems.Button 
              option
              close
              icon="times"
              onPress={() => store.set({ error: null, success: null })} />
          </Info.Close>
          <Info.Text>{error?.message || success?.message || message}</Info.Text>
        </Info.Touch>}
      {props.children}
    </>
  }

})

export default Info.Comp

const Loader = Actheme.create({

  Wrap: 'View',
  Image: 'Image',

  Comp: () => {
    return (
      <Loader.Wrap style={Actheme.style('ai,jc:ctr pos:fixed l,r,t,b:0 z:999 bg:white p:s5')}>
        <Loader.Image style={Actheme.style('w,h:s50')} source={'/static/unilogo.gif'} />
      </Loader.Wrap>
    )
  }

})