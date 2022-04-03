import React, { useState, useEffect } from 'react'
import { Comps, Actheme } from 'pack'
import Actstore from 'actstore'

export default function ProfileScreen() {

  const { store, handle } = Actstore({}, ['user', 'posts'])
  const router = handle.useRouter()
  const { id } = router?.query || {}
  const { user, users } = store.get('user', 'users')
  const profile = users?.find(user => user.id === id) || {}
  const data = (store.get('posts') || []).filter(post => post.userId === id)
  
  const [posts, setPosts] = useState(data)
  const [mode, setMode] = useState('posts')
  const [edit, setEdit] = useState()
  const [changeNav, setChangeNav] = useState()

  useEffect(() => {
    setPosts(data)
  }, [user, mode, edit, id])

  const renderItem = ({item}) => 
    <Comps.Post
      id={id}
      post={item}
      user={user}
      profile={profile}
      onEdit={() => setEdit((posts.find(post => String(post.id) === String(item.id))) || {})}
      onRemove={() => setMode(!mode)} />

  const handleNav = (e) => {
    const scrolled = e.nativeEvent.contentOffset.y
    scrolled > 264
      ? setChangeNav(true)
      : setChangeNav(false)
  }

  return (
    <Profile.Container>
      <Comps.Meta
        title={profile.username || id}
        desc="profile"
        url={`https://atunicorn.io/profile/${id}`}
        cover={profile.url} />
      {profile?.id
        ? <Comps.List
            data={posts}
            item={renderItem}
            onScroll={handleNav}
            navigation={
              <Comps.Nav
                mode={mode}
                setMode={setMode}
                data={data} 
                posts={posts} 
                setPosts={setPosts}
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
                action={user ? () => setMode(upload) : null} />
            }
          />
        : <Profile.ScrollView stickyHeaderIndices={[0]}>
            <Comps.Nav changeNav /> 
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
        <Comps.Upload post={edit} onClose={() => edit ? setEdit(false) : setMode(!mode)} />}
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