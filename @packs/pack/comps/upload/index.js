import React from 'react'
import Elems from '../../elems'
import { Actheme } from '../../theme'
import Actstore from 'actstore'

const Upload = Actheme.create({
  Wrap: ['View', 'fd:col w:100% xw:s100 m:s5'],
  File: 'Upload',
  Input: ['TextInput', ['c:black fs:s4 mt:s5 p:s5 bw:1 bc:black50 bg:white200 br:s5', { multiline: true, numberOfLines: 2 }], {
    active: 'bc:mediumseagreen'
  }],
  Checkbox: ['Checkbox', ''],
  Text: ['Text', ['ta:c c:mediumseagreen w:100% fs:s4 fb:bold', { numberOfLines: 1 }]],
  Touch: ['TouchableOpacity', 'w:100% h:s100 jc,ai:c bw:1 bc:black50 bg:white br:s5 of:hd'],
  Image: ['Image', 'w:100% xw,h:100%'],

  Comp: props => {

    const { act, store } = Actstore({}, ['user', 'posts', 'uploading'])
    const { uploading } = store.get('user', 'users', 'uploading')
    const [url, setUrl] = React.useState()
    const [desc, setDesc] = React.useState()
    const [nsfw, setNsfw] = React.useState()

    return (
      <Upload.Wrap>
        <Upload.File action={files => act('APP_UPLOAD', files).then(setUrl)}>
          <Upload.Touch>
            {uploading
              ? <Elems.Button iconSize="s20" icon="spinner-third" spin />
              : !url
                ? <>
                    <Elems.Icon style={Actheme.style('fs:s20 mb:s5 c:mediumseagreen')} icon="plus-circle"/>
                    <Upload.Text>Upload Picture</Upload.Text>
                  </>
                : <Upload.Image source={url} />
            }
          </Upload.Touch>
        </Upload.File>
        {url && <Upload.Input
          onChangeText={setDesc}
          placeholder="Type your description"/>}
        {url && desc && <Elems.Button icon={nsfw ? 'check-circle': 'circle'} iconColor="red" textColor="red" iconSize="s6" nsfw onPress={() => setNsfw(!nsfw)} text="NSFW" />}
        {url && desc && <Elems.Button post onPress={() => act('APP_POST', { url, desc, nsfw }).then(props.onClose)} text="Ready to make it public?" textColor="white" />}
      </Upload.Wrap>
  )}

})

export default Upload.Comp
