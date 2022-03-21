import React from 'react'
import { Elems, Comps, Actheme } from 'pack'
import Actstore from 'actstore'

export default function PostScreen() {
  const { store, handle } = Actstore({}, ['user', 'posts'])
  const router = handle.useRouter()
  const { id } = router?.query || {}
  const { users } = store.get('user', 'users')
  const post = (store.get('posts') || []).find(post => String(post.id) === id) || {}
  const profile = users?.find(user => user.id === post.userId) || {}

  return (
    <>
      <Comps.Meta
        title={post?.username}
        desc={post?.desc}
        url={`https://atunicorn.io/post/${id}`}
        cover={post?.url} />
      <Comps.Navalt />
      <Post.Container>
        <Post.Content>
          <Elems.Link href={`/profile/${post?.userId}`}>
            <Post.Profile>
              <Post.Wrap profile>
                {profile?.url
                  ? <Post.Image source={profile.url} />
                  : <Elems.Icon style={Actheme.style('c:lightgray fs:s15')} icon="user-circle" solid />
                }
              </Post.Wrap>
              <Post.Name>{`@${profile?.username || post?.userId}`}</Post.Name>
            </Post.Profile>
          </Elems.Link>
          <Post.Wrap image>
            {post?.url
              ? <Post.Image source={[post.url, 'image'].join('#')} />
              : <Elems.Icon style={Actheme.style('fs:s40 p:s20 c:lightgray')} spin icon="yin-yang" />
            }
          </Post.Wrap>
          <Post.Text>{post?.desc || post?.userId}</Post.Text>
        </Post.Content>
      </Post.Container>
    </>
  )
}

const Post = Actheme.create({
  Container: ['ScrollView', ['f:1', {
    contentContainerStyle: Actheme.style('ai,jc:c p:s5 pt:s25 pb:s10')}]],
  Content: 'w:100% xw:s150 bw:1 bc:black50 br:s5 bg:white of:hd',
  Image: ['Image', 'w,h:100%'],
  Text: ['Text', 'fs:s4 p:s5'],
  Wrap: ['View', 'w:100% xw:s150', {
    image: 'btw:1 bbw:1 bc:black50 ai,jc:c',
    profile: 'fd:row jc,ai:c w,h,br:s15 of:hd',}],
  Profile: ['View', 'fd:row ai:c m:s5'],
  Name: ['Text', 'fs:s4 fb:500 ml:s2'],
  Delete: ['View', 'w,h,br:s8 of:hd bg:black200 ai,jc:c ml:auto'],
})