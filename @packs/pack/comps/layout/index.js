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

  Comp: () => {
    const { store } = Actstore({}, ['error', 'user'])

    return <Loader.Wrap style={Actheme.style('ps:ab l,r,t,b:0 z:1 bg:green dp:flex jc,ai:c')}>
      {/* <Elems.Button icon="atom-alt" style={Actheme.style('fs:s55 c:gainsboro bw:0')} spin /> */}
      <Loader.Wrap style={Actheme.style('w,h:s55 bg:yellow dp:flex as:c')}>
        {/* <Elems.Icon style={Actheme.style('fs:s55 c:gainsboro')} icon="atom-alt" spin /> */}
      </Loader.Wrap>
    </Loader.Wrap>
  }

})