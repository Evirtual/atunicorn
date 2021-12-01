import React from 'react'
import Elems from '../../elems'
import { Actheme } from '../../theme'
import Actstore from 'actstore'

const Upload = Actheme.create({
  Wrap: ['View', 'fd:col w:100% xw:s100 m:s5'],
  File: 'Upload',
  Input: ['TextInput', ['c:black fs:s4 mt:s5 p:s5 bw:1 bc:black50 bg:white200 br:s5', { multiline: true, numberOfLines: 2 }], {
    active: 'bc:green'
  }],
  Text: ['Text', ['ta:c c:pink w:100% fs:s4 fb:bold', { numberOfLines: 1 }]],
  Touch: ['TouchableOpacity', 'w:100% h:s100 jc,ai:c bw:1 bc:black50 bg:white200 br:s5 of:hd'],
  Image: ['Image', 'w:100% xw,h:s100 bw:1 bc:black100 br:s5 of:hd bg:white200'],

  Comp: props => {

    const { action, act } = Actstore({}, [])
    const [active, setActive] = React.useState()
    const [url, setUrl] = React.useState()
    const [desc, setDesc] = React.useState()

    return <Upload.Wrap>
      <Upload.File action={files => act('APP_UPLOAD', files).then(setUrl)}>
        {!url
          ? <Upload.Touch>
              <Elems.Icon style={Actheme.style('c:pink fs:s20 mb:s5')} icon="plus-circle"/>
              <Upload.Text>Upload Picture</Upload.Text>
            </Upload.Touch>
          : <Upload.Image source={url} />}
      </Upload.File>
      {url && <Upload.Input
        onChangeText={setDesc}
        placeholder="Type your description"
        active={active}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)} />}
      {url && desc && <Elems.Button post onPress={() => act('APP_POST', { url, desc }).then(props.onClose)} text="Ready to make it public?" textColor="white" />}
    </Upload.Wrap>
  }

})

export default Upload.Comp
