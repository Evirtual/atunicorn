import React, { useState } from 'react'
import { Elems, Comps, Actheme } from 'pack'

export default function PostScreen(props) {

  const { act, user, users, posts, postId, setPostId, mode, setMode, router, urlId } = props

  const post = posts?.find(post => String(post.id) === String(postId || urlId)) || {}

  const profile = users?.find(user => user.id === post?.userId) || {}
  
  const [edit, setEdit] = useState()
  const [recycling, setRecycling] = useState()

  return (
    <Post.Container mode={postId}>
      {!mode && 
        <Comps.Meta
          title={profile?.username}
          desc={post?.desc}
          url={`https://atunicorn.io/post/${urlId}`}
          cover={post?.url} />
      }
      <Post.ScrollView stickyHeaderIndices={postId && [0]}>
        {!postId &&
          <Comps.Nav 
            post={post}
            mode={mode}
            setMode={setMode}
            changeNav />
        }

        {post?.id
          ? <Post.Wrap content mode={postId}>
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
                <Post.Options>
                  {(user && user?.id === ( profile?.id || post?.userId ) && !recycling) && 
                    <>
                      <Elems.Button
                        option
                        edit
                        regular
                        icon="pencil"
                        onPress={() => setEdit(true)} />
                      <Elems.Button
                        option
                        recycle
                        regular
                        icon="recycle"
                        onPress={() => 
                          act('APP_DELETEPOST', { userId: user?.id, postId: post?.id , url: post.url })
                            .then(setRecycling(true), setTimeout(() => router.back(),2000))}
                        style={Actheme.style('ml:s2')} />
                    </>
                  }
                  {postId &&
                    <Elems.Button
                      option
                      close
                      icon="times"
                      onPress={() => (
                        setPostId(false),
                        router.back()
                      )}
                      style={Actheme.style('ml:s2')} />
                  }
                </Post.Options>
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

      {edit && 
        <Comps.Upload post={post} onClose={() => setEdit(false)} />
      }

    </Post.Container>
  )
}

const Post = Actheme.create({
  Container: ['View', 'f:1 bg:grey',{
    mode: 'ps:fixed t,b,l,r:0 z:9 bg:black400'
  }],
  ScrollView: ['ScrollView', ['f:1', {
    contentContainerStyle: Actheme.style('fg:1 ai,jc:c')}]],
  Content: ['View', 'bw:1 bc:grey br:s5 bg:white of:hd w:90vw xw:s150', {
    placeholder: 'nh,xw:s95'
  }],
  Wrap: ['View', 'w:100%', {
    image: 'btw:1 bbw:1 bc:grey',
    profile: 'fd:row w,h,br:s12 of:hd',
    content: 'f:1 ai,jc:c mh:s5 mv:s22.5',
    mode: 'mv:s5'}],
  Image: ['Image', 'w,h:100%'],
  Text: ['Text', 'fs:s4 p:s4 c:black400',],
  Profile: ['View', 'w:100% fd:row ai:c p:s2'],
  Name: ['Text', 'fs:s4 fb:500 ml:s2'],
  Options: ['View', 'fd:row ps:ab t,r:s2 ai,jc:c z:3'],
})