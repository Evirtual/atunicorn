import React, { useEffect } from 'react'
import Elems from '../../elems'
import { Actheme } from '../../theme'
import Actstore from 'actstore'

const Info = Actheme.create({

  Touch: ['TouchableOpacity', 'w:100% jc,ai:c p:s3 bg:salmon z:1', {
    update: 'bg:skyblue',
    success: 'bg:lightgreen',
    error: 'bg:salmon' }],
  Text: ['Text', 'c:black fb:500 fs:s4'],
  Close: ['View', 'w,h,br:s6 of:hd ps:ab t,r:s2.5 z:3 bg:black200 ai,jc:c'],

  Comp: ({message = 'Something went wrong'}) => {
    const { store } = Actstore({}, ['error', 'success', 'user', 'ready'])
    const { error, success, user, ready } = store.get('error', 'success', 'user', 'ready')

    useEffect(() => {success && store.set({ error: null })}, [success])
    useEffect(() => {error && store.set({ success: null })}, [error])

    return <>
      {!ready && <Loader.Comp />}
      {user && !user.approved && <Info.Touch update>
        <Info.Text>Account is pending for approval. Meanwhile you can upload profile picture, change nickname/id and edit about section.</Info.Text>
      </Info.Touch>}
      {(error || success) && <Info.Touch success={success} onPress={() => store.set({ error: null, success: null })}>
        <Info.Close>
          <Elems.Button icon="times-circle" iconSize="s6" color="white" onPress={() => store.set({ error: null, success: null })} />
        </Info.Close>
        <Info.Text>{error?.message || success?.message || message}</Info.Text>
      </Info.Touch>}
    </>
  }

})

export default Info.Comp

const Loader = Actheme.create({

  Wrap: 'View',
  Image: 'Image',

  Comp: () => {
    return <Loader.Wrap style={Actheme.style('display:flex justifyContent:center alignItems:center ps:fixed l,r,t,b:0 z:999 bg:white')}>
      <Loader.Image style={Actheme.style('w,h:s50')} source={'/static/unicorn-io.gif'} />
    </Loader.Wrap>
  }

})