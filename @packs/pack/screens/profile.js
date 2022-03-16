import React, { useState, useEffect } from 'react'
import { useWindowDimensions } from 'react-native'
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
  const [ mode, setMode ] = useState('posts')
  const [showNavalt, setShowNavalt] = useState()
  const { width } = useWindowDimensions()

  useEffect(() => {setPosts(data)}, [user, mode])

  const renderItem = ({item}) => 
    <Comps.Post
      id={id}
      post={item}
      user={user}
      profile={profile}
      onRemove={() => setMode(!mode)} />

  const handleNavalt = (e) => {
    const scrolled = e.nativeEvent.contentOffset.y
    scrolled > 280 
      ? setShowNavalt(true)
      : setShowNavalt(false)
  }

  return (
    <Profile.Container>
      <Comps.Meta
        title={profile.username || id}
        desc={profile.about}
        url={`https://atunicorn.io/profile/${id}`}
        cover={profile.url} />
      {showNavalt &&
        <Comps.Navalt
          mode={mode}
          setMode={setMode}
          data={data} 
          posts={posts} 
          setPosts={setPosts} />
      }
      {mode === 'upload' && <Comps.Upload disabled={!user || !user.approved} onClose={() => setMode(!mode)} />}
      <Profile.Content 
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Elems.Button icon="yin-yang" loadingpost spin style={Actheme.style('fs:s35 c:lightgray')} />}
        key={width}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={6}
        onScroll={handleNavalt}
        numColumns={(width < 768 ) ? 1 : (width < 1280) ? 2 : 3}
        ListHeaderComponent={
          <Comps.Nav
            mode={mode}
            setMode={setMode}
            data={data} 
            posts={posts} 
            setPosts={setPosts} />}
      />
    </Profile.Container>
  )
}

const Profile = Actheme.create({
  Container: ['View', 'f:1 bg:#F2F2F2'],
  Content: ['FlatList', ['f:1', {
    contentContainerStyle: Actheme.style('ai,jc:c ph:s5 pv:s10')}]],
  Text: ['Text', 'fs,mb:s6 ta:c', {
    small: 'fs:s3'}],
  Wrap: ['View', 'w:100% ai:c']
})