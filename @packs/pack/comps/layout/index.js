import React from 'react'
import Elems from '../../elems'
import { Actheme } from '../../theme'
import Actstore from 'actstore'

const Info = Actheme.create({

  Touch: ['TouchableOpacity', 'w:100% jc,ai:c p:s3 bg:salmon z:1', {
    update: 'bg:skyblue' }],
  Text: ['Text', 'c:black fb:500 fs:s4'],

  Comp: ({message = 'something went wrong'}) => {
    const { store } = Actstore({}, ['error', 'user', 'ready'])
    const { error, user, ready } = store.get('error', 'user', 'ready')

    return <>
      {!ready && <Loader.Comp />}
      {user && !user.approved && <Info.Touch update>
        <Info.Text>account is pending for approval. meanwhile you can upload profile picture, change nickname/id and edit about section.</Info.Text>
      </Info.Touch>}
      {error && <Info.Touch onPress={() => store.set({ error: null })}>
        <Info.Text>{error?.message || message}</Info.Text>
      </Info.Touch>}
    </>
  }

})

export default Info.Comp

const Loader = Actheme.create({

  Wrap: 'View',
  Image: 'Image',

  Comp: () => {
    return <Loader.Wrap style={Actheme.style('display:flex justify-content:center align-items:center ps:fixed l,r,t,b:0 z:999 bg:white')}>
      <Loader.Image style={Actheme.style('w,h:s50')} source={'/static/unicorn-io.gif'} />
    </Loader.Wrap>
  }

})