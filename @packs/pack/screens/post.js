import React from 'react'
import { Comps, Elems, Actheme } from 'pack'
import Actstore from 'actstore'

export default function PostScreen(props) {
  const { store, handle } = Actstore({}, ['user', 'posts'])
  const router = handle.useRouter()
  const { id } = router?.query || {}
  const { users } = store.get('user', 'users')
  const post = (store.get('posts') || []).find(post => String(post.id) === id) || {}
  const profile = users?.find(item => item.id === post.userId) || { url:'https://c.tenor.com/xD2H2paGBt4AAAAC/prizzzle-unicorn.gif', desc: post.userId }

  return <Post.Container>
    <Post.Wrap>
      <Elems.Button text="Back" icon="arrow-left" inline onPress={() => router.back()} />
    </Post.Wrap>
    <Post.Content>
      <Post.Profile onPress={() => router.push('/profile/' + post.userId)}>
        <Post.Wrap profile>
          <Post.Image source={profile.url} />
        </Post.Wrap>
        <Post.Name>{'@' + profile?.desc}</Post.Name>
      </Post.Profile>
      <Post.Wrap image>
        <Post.Image source={post.url} />
      </Post.Wrap>
      <Post.Text>{post?.desc}</Post.Text>
    </Post.Content>
  </Post.Container>
}

const Post = Actheme.create({
  Container: ['ScrollView', ['f:1', { contentContainerStyle: Actheme.style('fg:1 p:s5 ai,jc:c bg:black25'), showsVerticalScrollIndicator: false }]],
  Image: ['Image', 'w,h:100%'],
  Content: 'w:100% xw:s150 bw:1 bc:black50 br:s5 bg:white of:hd mt:s5',
  Text: ['Text', 'fs:s4 p:s5'],
  Wrap: ['View', 'w:100% xw:s150', {
    image: 'h:s150 btw:1 bbw:1 bc:black50',
    profile: 'fd:row ai:c w,h,br:s15 of:hd',}],
  Profile: ['TouchableOpacity', 'fd:row ai:c m:s5'],
  Name: ['Text', 'fs:s4 fb:500 ml:s2'],
})