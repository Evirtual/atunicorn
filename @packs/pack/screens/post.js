import React, { useState } from 'react'
import { Elems, Comps, Actheme } from 'pack'
import Actstore from 'pack/store/actstore'
import { buildProfileRoute } from './route-state'

const cloudinaryDeliveryUrl = (source, transformation) => {
  if (!source?.includes('res.cloudinary.com/') || !source.includes('/image/upload/')) return source
  return source.replace('/image/upload/', `/image/upload/${transformation}/`)
}

export default function PostScreen(props) {

  const {
    act: propAct,
    user: propUser,
    users: propUsers,
    posts: propPosts,
    postId,
    mode,
    setMode,
    router: propRouter,
    id: propId,
    profileId,
    setProfileId,
    onClose,
  } = props

  const { act: storeAct, store, handle } = Actstore({}, ['user', 'users', 'posts'])
  const router = propRouter || handle.useRouter()
  const { id: routeId } = router?.query || {}

  const act = propAct || storeAct
  const user = typeof propUser !== 'undefined' ? propUser : store.get('user')
  const users = typeof propUsers !== 'undefined' ? propUsers : store.get('users')
  const posts = typeof propPosts !== 'undefined' ? propPosts : store.get('posts')
  const id = propId || routeId
  const resolvedPostId = postId || id
  const setCurrentMode = setMode || (() => null)
  const backHref = profileId ? buildProfileRoute(profileId) : '/'
  const closePost = onClose || (() => router.replace(backHref))

  const post = posts?.find(post => String(post.id) === String(resolvedPostId)) || {}

  const profile = users?.find(user => user.id === (post?.userId)) || {}
  const loadingPost = !resolvedPostId || typeof posts === 'undefined'
  
  const [edit, setEdit] = useState()
  const [recycling, setRecycling] = useState()

  return (
    <Post.Container mode={postId}>
      {!mode && 
        <Comps.Meta
          title={profile?.username}
          desc={post?.desc}
          url={`https://atunicorn.io/post/${resolvedPostId || ''}`}
          cover={post?.url} />
      }
      <Post.ScrollView stickyHeaderIndices={postId ? undefined : [0]}>
        {!postId &&
          <Comps.Nav 
            post={post}
            mode={mode}
            setMode={setCurrentMode}
            backHref={backHref}
            changeNav />
        }

        {post?.id
          ? <Post.Wrap content mode={postId}>
              <Post.Content>
                {profile?.id !== (profileId || id) &&
                  <Elems.Link 
                    href={buildProfileRoute(post?.userId || id)}
                    onClick={() => setProfileId && setProfileId(post?.userId)}
                  >
                    <Post.Profile>
                      <Post.Wrap profile>
                        {profile?.url
                          ? <Post.Image
                              source={cloudinaryDeliveryUrl(
                                profile.url,
                                'f_auto,q_auto,c_fill,w_128,h_128'
                              )} />
                          : <Elems.Icon icon="user-circle" solid iconColor="black100" iconSize="s15" />
                        }
                      </Post.Wrap>
                      <Post.Name>{`@${profile?.username || profile?.id}`}</Post.Name>
                    </Post.Profile>
                  </Elems.Link>
                }
                <Post.Wrap>
                  {post?.url
                    ? <Post.Image 
                        profile={profile?.id === (profileId || id)}
                        source={[
                          cloudinaryDeliveryUrl(
                            post.url,
                            'f_auto,q_auto,c_limit,w_1200,h_1200'
                          ),
                          'image'
                        ].join('#')} />
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
                            .then(setRecycling(true), setTimeout(() => closePost(), 2000))}
                        style={Actheme.style('ml:s2')} />
                    </>
                  }
                  {postId &&
                    <Elems.Button
                      option
                      close
                      icon="times"
                      onPress={closePost}
                      style={Actheme.style('ml:s2')} />
                  }
                </Post.Options>
              </Post.Content>
            </Post.Wrap>
          : loadingPost
            ? <Post.Wrap content>
                <Post.Content placeholder>
                  <Comps.Placeholder
                    icon="yin-yang"
                    spin
                    title="Balancing" />
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
    mode: 'ps:fixed t,b,l,r:0 z:10 bg:black400'
  }],
  ScrollView: ['ScrollView', ['f:1', {
    contentContainerStyle: Actheme.style('fg:1 ai,jc:c')}]],
  Content: ['View', 'bw:1 bc:border br:s5 bg:white of:hd w:90vw xw:s150', {
    placeholder: 'nh,xw:s95'
  }],
  Wrap: ['View', 'w:100%', {
    profile: 'fd:row w,h,br:s12 of:hd',
    content: 'f:1 ai,jc:c mh:s5 mv:s22.5',
    mode: 'mv:s5'}],
  Image: ['Image', 'w,h:100%', {
    profile: 'btlr,btrr:s5'
  }],
  Text: ['Text', 'fs:s4 p:s4 c:black400',],
  Profile: ['View', 'w:100% fd:row ai:c p:s2'],
  Name: ['Text', 'fs:s4 fb:500 ml:s2'],
  Options: ['View', 'fd:row ps:ab t,r:s2 ai,jc:c z:3'],
})
