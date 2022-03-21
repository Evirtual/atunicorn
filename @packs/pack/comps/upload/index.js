import React, { useState } from 'react'
import { Actheme } from '../../theme'
import Elems from '../../elems'
import Actstore from 'actstore'

const Upload = Actheme.create({
  Container: ['ScrollView', ['f:1 ps:fixed l,r,t,b:0 z:99 bg:black300', {
    contentContainerStyle: Actheme.style('fg:1 ai,jc:c p:s5')}]],
  Content: ['View', 'xw:s90 p:s4 bg:#F2F2F2 bw:1 bc:black50 br:s5'],
  File: ['Upload', ['w,h:100%']],
  Checkbox: 'Checkbox',
  Text: ['Text', 'ta:c c:lightgray w:100% fs:s5 fb:500 mt:s5'],
  Touch: ['TouchableOpacity', 'w,h:80vw xw,xh:s80 jc,ai:c bg:white br:s5 of:hd bw:1 bc:black50', {
    disabled: 'op:.25'}],
  Image: ['Image', 'w,h:100%'],
  Close: ['View', 'ps:ab t,r:s2 ai,jc:c z:3'],

  Comp: props => {

    const { disabled, onClose, post } = props
    const { act, store } = Actstore({}, ['user', 'posts', 'uploading'])
    const { uploading } = store.get('user', 'users', 'uploading')
    const [url, setUrl] = useState(post?.url || null)
    const [desc, setDesc] = useState(post?.desc || null)
    const [nsfw, setNsfw] = useState(post?.nsfw || false)

    return (
      <Upload.Container>
        <Upload.Content>
          <Upload.Close>
            <Elems.Button
              option
              icon="times"
              iconSize="s4"
              color="white"
              onPress={onClose} />
          </Upload.Close>
          {!disabled
            ? <Upload.File action={files => act('APP_UPLOAD', files, 'post').then(setUrl)}>
                <Upload.Touch>
                  {url || post?.url
                    ? <Upload.Image source={url || post?.url} />
                    : uploading == 'post'
                      ? <>
                          <Elems.Icon style={Actheme.style('fs:s30 c:lightgray')} icon="yin-yang" spin />
                          <Upload.Text>Uploading</Upload.Text>
                        </>
                      : <>
                          <Elems.Icon style={Actheme.style('fs:s30 c:lightgray')} icon="plus-circle" />
                          <Upload.Text>Upload Image</Upload.Text>
                        </>
                  }
                </Upload.Touch>
              </Upload.File>
            : <Upload.Touch disabled>
                <Elems.Icon style={Actheme.style('fs:s30 c:lightgray')} icon="plus-circle" />
                <Upload.Text>Upload Image</Upload.Text>
              </Upload.Touch>
          }
          {(url || post?.url) &&
            <Elems.Input
              multiline
              numberOfLine={3}
              defaultValue={post?.desc || ''}
              onChangeText={setDesc}
              placeholder="Type your description"
              style={Actheme.style('mt:s5')} />}
          {(url || post?.url) && (desc) &&
            <Elems.Button
              icon={nsfw ? 'check-circle': 'circle'} 
              iconColor="red" textColor="red" 
              iconSize="s6" 
              nsfw
              onPress={() => setNsfw(!nsfw)} 
              text="NSFW" />}
          {(url || post?.url) && desc &&
            <Elems.Button 
              submit 
              onPress={() => act('APP_POST', { id: post?.id, url, desc, nsfw }).then(onClose)} 
              text="Ready to make it public?" />}
        </Upload.Content>
      </Upload.Container>
    )
  }
})

export default Upload.Comp
