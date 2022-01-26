import React from 'react'
import { Actheme } from '../../theme'
import Actstore from 'actstore'

const Info = Actheme.create({

  Touch: ['TouchableOpacity', 'w:100% jc,ai:c p:s3 bg:red z:1', {
    update: 'bg:skyblue' }],
  Text: ['Text', 'c:black fb:500 fs:s4'],

  Comp: ({message = 'something went wrong'}) => {
    const { store } = Actstore({}, ['error', 'user'])
    const { error, user } = store.get('error', 'user')

    return <>
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
