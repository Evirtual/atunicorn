import React, { useEffect, useState } from 'react'
import { Actheme } from '../../theme'
import Elems from '../../elems'
import Placeholder from '../placeholder'
import Actstore from 'pack/store/actstore'

const Upload = Actheme.create({
  Container: ['ScrollView', ['f:1 ps:fixed l,r,t,b:0 z:99 bg:black300', {
    contentContainerStyle: Actheme.style('fg:1 ai,jc:c p:s5')}]],
  Content: ['View', 'p:s3 bg:grey bw:1 bc:border br:s5'],
  File: ['Upload', ['w,h:100%']],
  Checkbox: 'Checkbox',
  Touch: ['TouchableOpacity', 'w,h:86vw xw,xh:s86 jc,ai:c bg:white br:s5 of:hd bw:1 bc:border'],
  Image: ['Image', 'w,h:100% br:s5'],
  Close: ['View', 'ps:ab t,r:s1.5 ai,jc:c z:3'],

  Comp: props => {

    const { onClose, post } = props
    const { act, store } = Actstore({}, ['user', 'posts', 'uploading'])
    const { uploading } = store.get('user', 'users', 'uploading')
    
    const [url, setUrl] = useState(post?.url || null)
    const [file, setFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)
    const [desc, setDesc] = useState(post?.desc || null)
    const [nsfw, setNsfw] = useState(post?.nsfw || false)

    useEffect(() => () => {
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
    }, [previewUrl])

    const selectImage = files => {
      const nextFile = files?.[0]
      if (!nextFile) return
      if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
      setFile(nextFile)
      setPreviewUrl(typeof URL !== 'undefined' && URL.createObjectURL ? URL.createObjectURL(nextFile) : nextFile.uri || null)
    }

    const publish = async () => {
      const uploadedUrl = file ? await act('APP_UPLOAD', [file], 'post') : url
      if (!uploadedUrl) return
      const saved = await act('APP_POST', { id: post?.id, url: uploadedUrl, desc, nsfw })
      if (saved) onClose()
    }

    const imageUrl = previewUrl || url || post?.url

    return (
      <Upload.Container>
        <Upload.Content>
          <Upload.Close>
            <Elems.Button
              option
              close
              icon="times"
              onPress={onClose} />
          </Upload.Close>
          <Upload.File action={selectImage}>
            <Upload.Touch>
              {uploading == 'post'
                ? <Placeholder
                    icon="yin-yang"
                    spin
                    title="Uploading" />
                : imageUrl
                  ? <Upload.Image source={imageUrl} />
                  : <Placeholder
                      icon="plus-circle"
                      title="Upload Image" />
              }
            </Upload.Touch>
          </Upload.File>
          {imageUrl &&
            <Elems.Input
              multiline
              numberOfLines={3}
              defaultValue={post?.desc || ''}
              onChangeText={setDesc}
              placeholder="Type your description"
              style={Actheme.style('mt:s4')} />
          }
          {imageUrl && desc &&
            <Elems.Button
              inline
              icon={nsfw ? 'check-circle': 'circle'} 
              iconColor="red" textColor="red" 
              iconSize="s7.5" 
              onPress={() => setNsfw(!nsfw)} 
              text="NSFW (not suitable for work)"
              style={Actheme.style('mt:s3')} />
          }
          {imageUrl && desc &&
            <Elems.Button 
              submit 
              onPress={publish}
              text={ post?.id ? 'Update' : 'Ready to make it public?'}
              style={Actheme.style('mt:s3')} />
          }
        </Upload.Content>
      </Upload.Container>
    )
  }
})

export default Upload.Comp
