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

  const handleNavalt = (e) => {
    const scrolled = e.nativeEvent.contentOffset.y
    scrolled > 180
      ? setChangeNav(true)
      : setChangeNav(false)
  }

  return (
    <Profile.Container>
      <Comps.Meta
        title={profile.username || id}
        desc={profile.about}
        url={`https://atunicorn.io/profile/${id}`}
        cover={profile.url} />
      {(mode === 'upload' || edit) && <Comps.Upload post={edit} onClose={() => edit ? setEdit(false) : setMode(!mode)} />}
      <Profile.Content 
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Elems.Button icon="yin-yang" loadingpost spin iconColor="lightgray" iconSize="s35" />}
        initialNumToRender={1}
        maxToRenderPerBatch={1}
        windowSize={6}
        onScroll={handleNavalt}
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
    </Profile.Container>
  )
}

const Profile = Actheme.create({
  Container: ['View', 'f:1 bg:#F2F2F2'],
  Content: ['FlatList', ['f:1', {
    contentContainerStyle: Actheme.style('ai,jc:c ph:s5 pt:s5 pb:s10'),
    columnWrapperStyle: Actheme.style('fw:wrap ai,jc:c'),
    ListHeaderComponentStyle: Actheme.style('fw:wrap ai,jc:c mb:s60')}]],
  Text: ['Text', 'fs,mb:s6 ta:c', {
    small: 'fs:s3'}],
  Wrap: ['View', 'w:100% ai:c']
})