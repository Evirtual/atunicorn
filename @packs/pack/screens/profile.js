import React, { useState, useEffect, useRef } from 'react'
import { Comps, Actheme } from 'pack' 

export default function ProfileScreen(props) {

  const { user, users, posts, mode, setMode, postId, setPostId, profileId, path, urlId } = props

  const url = path?.replace(/\/$/, '')
  const urlLastId = url?.substring(url.lastIndexOf('/') + 1)

  const profile = users?.find(user => user.id === (profileId || urlId)) || {}
  const filteredPosts = posts?.filter(post => post.userId === (profileId || urlId))

  const profilePath = `/profile/${profileId || urlId || urlLastId}/`
  const aboutPath = `/profile/${profileId || urlId || urlLastId}/about/`
  const postPath = `/post/${postId || urlLastId}/`
  
  const [loadPosts, setLoadPosts] = useState(filteredPosts)
  const [edit, setEdit] = useState()
  const [changeNav, setChangeNav] = useState()

  const listRef = useRef(null)

  useEffect(() => {
    path === aboutPath 
      ? setMode('about')
      : setMode(false)
  }, [path === aboutPath])

  useEffect(() => {
    path === postPath 
      ? setPostId(postId)
      : setPostId(false)
  }, [path === postPath])

  useEffect(() => {
    setLoadPosts(filteredPosts)
  }, [user, mode, edit, path, urlId, profileId])

  const renderItem = ({item}) => 
    <Comps.Post
      id={urlId}
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
    <Profile.Container mode={profile?.username || urlId || profileId}>
      {(!mode || !postId || profileId) &&
        <Comps.Meta
          title={profile?.username || urlId || profileId}
          desc="profile"
          url={`https://atunicorn.io/profile/${urlId || profileId}`}
          cover={profile?.url} />
      }
      {(profile?.id || user?.id === urlId)
        ? <Comps.List
            ref={listRef}
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
                icon={user?.id !== urlId && 'image-polaroid'}
                title={user && user?.id === urlId ? 'Welcome @unicorn' : 'No posts'}
                desc={user && user?.id === urlId && 'You can upload profile picture, change nickname/id and edit about section.'}
                disabled={user && !user.approved}
                actionText="Upload"
                actionTextColor="green"
                logo={user && user?.id === urlId}
                action={user && user?.id === urlId ? () => setMode('upload') : null} />
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
        <Comps.Upload post={edit} onClose={() => edit ? setEdit(false) : setMode(false)} />}

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