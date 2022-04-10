import React, { useState, useEffect } from 'react'
import { Comps, Actheme } from 'pack' 

export default function ProfileScreen(props) {

  const { user, users, posts, mode, setMode, path, urlId } = props

  const profile = users?.find(user => user.id === urlId) || {}
  const filteredPosts = posts?.filter(post => post.userId === urlId)

  const aboutPath = `/profile/${urlId}/about/`
  
  const [loadPosts, setLoadPosts] = useState(filteredPosts)
  const [edit, setEdit] = useState()
  const [changeNav, setChangeNav] = useState()

  useEffect(() => {
    path === aboutPath 
      ? setMode('about')
      : setMode(false)
  }, [path === aboutPath])

  useEffect(() => {
    setLoadPosts(filteredPosts)
  }, [user, mode, edit, urlId])

  const renderItem = ({item}) => 
    <Comps.Post
      id={urlId}
      post={item}
      user={user}
      profile={profile}
      onEdit={() => setEdit((loadPosts.find(post => String(post.id) === String(item.id))) || {})}
      onRemove={() => setMode(!mode)} />

  const handleNav = (e) => {
    const scrolled = e.nativeEvent.contentOffset.y
    scrolled > 264
      ? setChangeNav(true)
      : setChangeNav(false)
  }

  return (
    <Profile.Container>
      {!mode &&
        <Comps.Meta
          title={profile.username || urlId}
          desc="profile"
          url={`https://atunicorn.io/profile/${urlId}`}
          cover={profile.url} />
      }
      {profile?.id || user?.id === urlId
        ? <Comps.List
            data={loadPosts}
            item={renderItem}
            onScroll={handleNav}
            navigation={
              <Comps.Nav
                mode={mode}
                setMode={setMode}
                posts={posts}
                setPosts={setLoadPosts}
                changeNav={changeNav} />
            }
            placeholder={
              <Comps.Placeholder
                flatlist
                icon={!user && 'image-polaroid'}
                title={user ? 'Welcome @unicorn' : 'No posts'}
                desc={user && 'You can upload profile picture, change nickname/id and edit about section.'}
                disabled={user && !user.approved}
                actionText="Upload"
                actionTextColor="green"
                logo={user}
                action={user ? () => setMode('upload') : null} />
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
  Container: ['View', 'f:1 bg:grey'],
  ScrollView: ['ScrollView', ['f:1', {
    contentContainerStyle: Actheme.style('fg:1 w:100% ai,jc:c')}]],
  Content: ['View', 'f:1 ai,jc:c mh:s5 mv:s22.5'],
  Wrap: ['View', 'as:c jc,ai:c bw:1 bc:black50 br:s5 bg:white of:hd w:90vw nh,xw:s95']
})