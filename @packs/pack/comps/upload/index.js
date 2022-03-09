import React from 'react'
import Elems from '../../elems'
import { Actheme } from '../../theme'
import Actstore from 'actstore'

const Upload = Actheme.create({
  Wrap: ['View', 'fd:col w:100% xw:s100 m:s5'],
  File: 'Upload',
  Checkbox: 'Checkbox',
  Text: ['Text', 'ta:c c:lightgray w:100% fs:s7 fb:bold mt:s2'],
  Touch: ['TouchableOpacity', 'w:100% h:s100 jc,ai:c bg:white br:s5 of:hd', {
    disabled: 'op:.25' }],
  Image: ['Image', 'w:100% xw,h:100%'],

  Comp: props => {

    const { act, store } = Actstore({}, ['user', 'posts', 'uploading'])
    const { uploading } = store.get('user', 'users', 'uploading')
    const [url, setUrl] = React.useState()
    const [desc, setDesc] = React.useState()
    const [nsfw, setNsfw] = React.useState()

    return (
      <Upload.Wrap>
        {!props.disabled
          ? <Upload.File action={files => act('APP_UPLOAD', files, 'post').then(setUrl)}>
              <Upload.Touch>
                {uploading == 'post'
                  ? <>
                      <Elems.Icon style={Actheme.style('fs:s35 c:lightgray')} icon="yin-yang" spin />
                      <Upload.Text>Uploading</Upload.Text>
                    </>
                  : !url
                    ? <>
                        <Elems.Icon style={Actheme.style('fs:s35 c:lightgray')} icon="plus-circle" />
                        <Upload.Text>Upload Image</Upload.Text>
                      </>
                    : <Upload.Image source={url} />
                }
              </Upload.Touch>
            </Upload.File>
          : <Upload.Touch disabled>
              <Elems.Icon style={Actheme.style('fs:s35 c:lightgray')} icon="plus-circle" />
              <Upload.Text>Upload Image</Upload.Text>
            </Upload.Touch>
        }
        {url && <Elems.Input multiline numberOfLine={2} onChangeText={setDesc} placeholder="Type your description" style={Actheme.style('mt:s5')} />}
        {url && desc && <Elems.Button icon={nsfw ? 'check-circle': 'circle'} iconColor="red" textColor="red" iconSize="s6" nsfw onPress={() => setNsfw(!nsfw)} text="NSFW" />}
        {url && desc && <Elems.Button submit onPress={() => act('APP_POST', { url, desc, nsfw }).then(props.onClose)} text="Ready to make it public?" />}
      </Upload.Wrap>
  )}

})

export default Upload.Comp
