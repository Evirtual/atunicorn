import React from 'react'
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
  Close: ['View', 'w,h,br:s8 bg:black200 ps:ab t,r:s2 ai,jc:c z:3'],

  Comp: props => {

    const { act, store } = Actstore({}, ['user', 'posts', 'uploading'])
    const { uploading } = store.get('user', 'users', 'uploading')
    const [url, setUrl] = React.useState()
    const [desc, setDesc] = React.useState()
    const [nsfw, setNsfw] = React.useState()

    return (
      <Upload.Container>
        <Upload.Content>
          <Upload.Close>
            <Elems.Button
              remove
              icon="times"
              iconSize="s5"
              color="white"
              onPress={props.onClose} />
          </Upload.Close>
          {!props.disabled
            ? <Upload.File action={files => act('APP_UPLOAD', files, 'post').then(setUrl)}>
                <Upload.Touch>
                  {uploading == 'post'
                    ? <>
                        <Elems.Icon style={Actheme.style('fs:s30 c:lightgray')} icon="yin-yang" spin />
                        <Upload.Text>Uploading</Upload.Text>
                      </>
                    : !url
                      ? <>
                          <Elems.Icon style={Actheme.style('fs:s30 c:lightgray')} icon="plus-circle" />
                          <Upload.Text>Upload Image</Upload.Text>
                        </>
                      : <Upload.Image source={url} />
                  }
                </Upload.Touch>
              </Upload.File>
            : <Upload.Touch disabled>
                <Elems.Icon style={Actheme.style('fs:s30 c:lightgray')} icon="plus-circle" />
                <Upload.Text>Upload Image</Upload.Text>
              </Upload.Touch>
          }
          {url &&
            <Elems.Input
              multiline
              numberOfLine={2}
              onChangeText={setDesc}
              placeholder="Type your description"
              style={Actheme.style('mt:s5')} />}
          {url && desc &&
            <Elems.Button
              icon={nsfw ? 'check-circle': 'circle'} 
              iconColor="red" textColor="red" 
              iconSize="s6" 
              nsfw onPress={() => setNsfw(!nsfw)} 
              text="NSFW" />}
          {url && desc &&
            <Elems.Button 
              submit 
              onPress={() => act('APP_POST', { url, desc, nsfw }).then(props.onClose)} 
              text="Ready to make it public?" />}
        </Upload.Content>
      </Upload.Container>
    )
  }
})

export default Upload.Comp
