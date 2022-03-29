import React, { useState } from 'react'
import { Elems, Comps, Actheme } from 'pack'
import Actstore from 'actstore'

export default function PostScreen() {
  const { act, store, handle } = Actstore({}, ['user', 'posts'])
  const router = handle.useRouter()
  const { id } = router?.query || {}
  const { user, users } = store.get('user', 'users')
  const post = (store.get('posts') || []).find(post => String(post.id) === id) || {}
  const profile = users?.find(user => user.id === post?.userId) || {}
  
  const [edit, setEdit] = useState()
  const [recycling, setRecycling] = useState()

  return (
    <Post.Container>
      <Comps.Meta
        title={profile?.username}
        desc={post?.desc}
        url={`https://atunicorn.io/post/${id}`}
        cover={post?.url} />
      <Post.ScrollView stickyHeaderIndices={[0]}>
        <Comps.Nav changeNav />
        {post?.id
          ? <Post.Wrap content>
              <Post.Content>
                <Elems.Link href={`/profile/${post?.userId}`}>
                  <Post.Profile>
                    <Post.Wrap profile>
                      {profile?.url
                        ? <Post.Image source={profile.url} />
                        : <Elems.Icon icon="user-circle" solid iconColor="black100" iconSize="s15" />
                      }
                    </Post.Wrap>
                    <Post.Name>{`@${profile?.username || profile?.id}`}</Post.Name>
                  </Post.Profile>
                </Elems.Link>
                <Post.Wrap image>
                  {post?.url
                    ? <Post.Image source={[post.url, 'image'].join('#')} />
                    : <Comps.Placeholder icon="yin-yang" spin />
                  }
                </Post.Wrap>
                <Post.Wrap>
                  <Post.Text>{post?.desc || post?.userId}</Post.Text>
                </Post.Wrap>
                {(user && user?.id === ( profile?.id || post?.userId ) && !recycling) && 
                  <Post.Options>
                    <Elems.Button
                      option
                      edit
                      regular
                      icon="pencil"
                      onPress={() => setEdit(true)}
                      style={Actheme.style('mr:s2')} />
                    <Elems.Button
                      option
                      recycle
                      regular
                      icon="recycle"
                      onPress={() => 
                        act('APP_DELETEPOST', { userId: user?.id, postId: post?.id , url: post.url })
                          .then(setRecycling(true), setTimeout(() => router.back(),2000))} />
                  </Post.Options>
                }
              </Post.Content>
            </Post.Wrap>
          : recycling
            ? <Post.Wrap content>
                <Post.Content placeholder>
                  <Comps.Placeholder
                    icon="yin-yang"
                    spin
                    title="Recycling" />
                </Post.Content>
              </Post.Wrap>
            : <Post.Wrap content>
                <Post.Content placeholder>
                  <Comps.Placeholder
                    icon="image-polaroid" 
                    title="Post doesn't exist" />
                </Post.Content>
              </Post.Wrap>
        }
      </Post.ScrollView>
      {edit && <Comps.Upload post={post} onClose={() => setEdit(false)} />}
    </Post.Container>
  )
}

const Post = Actheme.create({
  Container: ['View', 'f:1 bg:grey'],
  ScrollView: ['ScrollView', ['f:1', {
    contentContainerStyle: Actheme.style('fg:1 ai,jc:c')}]],
  Content: ['View', 'bw:1 bc:black50 br:s5 bg:white of:hd w:90vw xw:s150', {
    placeholder: 'nh,xw:s95'
  }],
  Wrap: ['View', 'w:100%', {
    image: 'btw:1 bbw:1 bc:black50',
    profile: 'fd:row w,h,br:s15 of:hd',
    content: 'f:1 ai,jc:c mh:s5 mv:s22.5'}],
  Image: ['Image', 'w,h:100%'],
  Text: ['Text', 'fs:s4 p:s4 c:black400',],
  Profile: ['View', 'w:100% fd:row ai:c p:s3.5'],
  Name: ['Text', 'fs:s4 fb:500 ml:s2'],
  Options: ['View', 'fd:row ps:ab t,r:s2 ai,jc:c z:3'],
})