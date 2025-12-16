import React, { useState, useEffect } from 'react'
import Actstore from 'pack/store/actstore'
import { Comps, Actheme } from 'pack' 
import Post from 'pack/screens/post'
import About from 'pack/screens/about'

export default function ProfileScreen(props) {

  const { profileId } = props

  const { act, store, handle } = Actstore({}, ['ready', 'user', 'users', 'posts'])
  const { user, users, posts } = store.get('user', 'users', 'posts')

  const router = handle.useRouter()
  const { id } = router.query || {}
  const path = router.asPath || null

  const profile = users?.find(user => user.id === (profileId || id)) || {}
  const filteredPosts = posts?.filter(post => post.userId === (profileId || id))

  const [loadPosts, setLoadPosts] = useState(filteredPosts)
  const [edit, setEdit] = useState()
  const [changeNav, setChangeNav] = useState()

  const [mode, setMode] = useState(false)
  const [postId, setPostId] = useState(false)

  const url = path?.replace(/\/$/, '')
  const urlLastId = url?.substring(url.lastIndexOf('/') + 1)

  const aboutPath = `/profile/${profileId || id || urlLastId}/about/`
  const postPath = `/post/${postId || id || urlLastId}/`

  useEffect(() => {
    path === aboutPath 
      ? setMode('about')
      : setMode(false)
  }, [path === aboutPath])

  useEffect(() => {
    path === postPath 
      ? setPostId(postId || id || urlLastId)
      : setPostId(false)
  }, [path === postPath])

  useEffect(() => {
    setLoadPosts(filteredPosts)
  }, [user, mode, edit, path, id, profileId])

  const renderItem = ({item}) => 
    <Comps.Post
      id={id}
      post={item}
      user={user}
      profile={profile}
      profileId={profileId}
      onPost={() => setPostId(item.id)}
      onEdit={() => setEdit((loadPosts.find(post => String(post.id) === String(item.id))) || {})}
      onRemove={() => setMode(!mode)} />

  const handleNav = (e) => {
    const scrolled = e.nativeEvent.contentOffset.y
    scrolled > 264
      ? setChangeNav(true)
      : setChangeNav(false)
  }

  return (
    <Profile.Container mode={profile?.username || id || profileId}>
      {(!mode || !postId || profileId) &&
        <Comps.Meta
          title={profile?.username || id || profileId}
          desc="profile"
          url={`https://atunicorn.io/profile/${id || profileId}`}
          cover={profile?.url} />
      }
      {(profile?.id || user?.id === id)
        ? <Comps.List
            data={loadPosts}
            item={renderItem}
            onScroll={handleNav}
            navigation={
              <Comps.Nav
                profileId={profileId}
                mode={mode}
                setMode={setMode}
                posts={filteredPosts}
                setPosts={setLoadPosts}
                changeNav={changeNav} />
            }
            placeholder={
              <Comps.Placeholder
                flatlist
                icon={user?.id !== id && 'image-polaroid'}
                title={user && user?.id === id ? 'Welcome @unicorn' : 'No posts'}
                desc={user && user?.id === id && 'You can upload profile picture, change nickname/id and edit about section.'}
                disabled={user && !user.approved}
                actionText="Upload"
                actionTextColor="green"
                logo={user && user?.id === id}
                action={user && user?.id === id ? () => setMode('upload') : null} />
            }
          />
        : <Profile.ScrollView stickyHeaderIndices={[0]}>
            <Comps.Nav 
              mode={mode}
              setMode={setMode}
              changeNav /> 
            <Profile.Content>
              <Profile.Wrap>
                <Comps.Placeholder
                  icon="user-circle"
                  title="Profile doesn't exist" />
              </Profile.Wrap>
            </Profile.Content>
          </Profile.ScrollView>
      }

      {(mode === 'upload' || edit) && 
        <Comps.Upload post={edit} onClose={() => edit ? setEdit(false) : setMode(false)} />
      }

      {mode === 'about' &&
        <About 
          act={act}
          store={store}
          router={router}
          path={path}
          id={id}
          profileId={profileId}
          user={user}
          users={users}
          mode={mode} 
          setMode={setMode} />
      }

      {postId && 
        <Post 
          act={act}
          postId={postId}
          id={id}
          user={user}
          users={users}
          posts={posts}
          router={router}
          path={path}
          setPostId={setPostId}
          profileId={profileId}
          mode={mode} 
          setMode={setMode} />
      }

    </Profile.Container>
  )
}

const Profile = Actheme.create({
  Container: ['View', 'f:1 bg:grey', {
    mode: 'ps:fixed t,b,l,r:0 z:9'
  }],
  ScrollView: ['ScrollView', ['f:1', {
    contentContainerStyle: Actheme.style('fg:1 w:100% ai,jc:c')}]],
  Content: ['View', 'f:1 ai,jc:c mh:s5 mv:s22.5'],
  Wrap: ['View', 'as:c jc,ai:c bw:1 bc:grey br:s5 bg:white of:hd w:90vw nh,xw:s95']
})