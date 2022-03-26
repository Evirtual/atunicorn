import React, { useState, useEffect } from 'react'
import { Comps, Elems, Actheme } from 'pack'
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
        ? <Profile.Content 
            data={posts}
            renderItem={renderItem}
            keyExtractor={item => item.id.toString()}
            ListEmptyComponent={
              <Profile.Wrap empty>
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
              </Profile.Wrap>
            }
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            windowSize={6}
            onScroll={handleNav}
            scrollEventThrottle={1}
            numColumns={6}
            stickyHeaderIndices={[0]}
            ListHeaderComponent={
              <Comps.Nav
                mode={mode}
                setMode={setMode}
                data={data} 
                posts={posts} 
                setPosts={setPosts}
                changeNav={changeNav} />}
          />
        : <>
            <Comps.Nav changeNav />
            <Profile.Wrap>
              <Comps.Placeholder
                icon="user-circle"
                title="Profile doesn't exist" />
            </Profile.Wrap>
          </>
      }
      {(mode === 'upload' || edit) && 
        <Comps.Upload post={edit} onClose={() => edit ? setEdit(false) : setMode(!mode)} />}
    </Profile.Container>
  )
}

const Profile = Actheme.create({
  Container: ['View', 'f:1 bg:grey'],
  Content: ['FlatList', ['f:1', {
    contentContainerStyle: Actheme.style('ai,jc:c pt:s66 pb:s10'),
    columnWrapperStyle: Actheme.style('fw:wrap ai,jc:c'),
    ListHeaderComponentStyle: Actheme.style('ai,jc:c')}]],
  Wrap: ['View', 'as:c bw:1 bc:black50 br:s5 bg:white of:hd mt:s25 w:90vw nh,xw:s90', {
    empty: 'mt:s2.5'
  }]
})