import React from 'react'
import { Elems, Actheme } from 'pack'
import Actstore from 'actstore'

export default function PostScreen() {
  const { store, handle } = Actstore({}, ['user', 'posts'])
  const router = handle.useRouter()
  const { id } = router?.query || {}
  const { users } = store.get('user', 'users')
  const post = (store.get('posts') || []).find(post => String(post.id) === id) || {}
  const profile = users?.find(item => item.id === post.userId) || {}

  return (
    <Post.Container>
      <Post.Wrap>
        <Elems.Button
          text="Back"
          icon="arrow-left"
          inline
          onPress={() => router.length ? router?.back() : router.push('/')} />
      </Post.Wrap>
      <Post.Content>
        <Post.Profile onPress={() => router.push('/profile/' + post.userId)}>
          <Post.Wrap profile>
            {profile.url
              ? <Post.Image source={profile.url} />
              : <Elems.Icon style={Actheme.style('c:lightgray fs:s15')} icon="user-circle" solid />
            }
          </Post.Wrap>
          <Post.Name>{'@' + (profile.username || post.userId)}</Post.Name>
        </Post.Profile>
        <Post.Wrap image>
          {!!post?.url
            ? <Post.Image source={[post.url, 'image'].join('#')} />
            : <Elems.Icon style={Actheme.style('fs:s40 p:s20 c:lightgray')} spin icon="yin-yang" />
          }
        </Post.Wrap>
        <Post.Text>{post?.desc || post?.userId}</Post.Text>
      </Post.Content>
    </Post.Container>
  )
}

const Post = Actheme.create({
  Container: ['ScrollView', ['f:1', {
    contentContainerStyle: Actheme.style('ai,jc:c p:s5 pv:s10')}]],
  Content: 'w:100% xw:s150 bw:1 bc:black50 br:s5 bg:white of:hd mt:s3 mb:s5',
  Image: ['Image', 'w,h:100%'],
  Text: ['Text', 'fs:s4 p:s5'],
  Wrap: ['View', 'w:100% xw:s150', {
    image: 'btw:1 bbw:1 bc:black50 ai,jc:c nh:s100',
    profile: 'fd:row jc,ai:c w,h,br:s15 of:hd',}],
  Profile: ['TouchableOpacity', 'fd:row ai:c m:s5'],
  Name: ['Text', 'fs:s4 fb:500 ml:s2'],
  Delete: ['View', 'w,h,br:s8 of:hd bg:black200 ai,jc:c ml:auto'],
})