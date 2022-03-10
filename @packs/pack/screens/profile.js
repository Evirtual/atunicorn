import React, { useState, useEffect } from 'react'
import { useWindowDimensions } from 'react-native'
import { Comps, Elems, Actheme } from 'pack'
import Actstore from 'actstore'

export default function ProfileScreen() {

  const { store, handle } = Actstore({}, ['user', 'posts'])
  const router = handle.useRouter()
  const { id } = router?.query || {}
  const { user, users } = store.get('user', 'users')
  const [ mode, setMode ] = useState('posts')
  const data = (store.get('posts') || []).filter(post => post.userId === id)
  const [posts, setPosts] = useState(data)
  const { width } = useWindowDimensions()

  useEffect(() => {setPosts(data)}, [user, mode])

  return (
    <Profile.Container>
      {mode === 'upload' && <Comps.Upload disabled={!user || !user.approved} onClose={() => setMode(!mode)} />}
      <Profile.Content 
        data={posts}
        renderItem={({item}) =>
          <Comps.Post
            medium={width > 767}
            large={width > 1279}
            id={id}
            post={item}
            user={user}
            profile={users?.find(i => i.id === item.userId)}
            onDelete={() => setMode(!mode)} />
        }
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Elems.Button icon="yin-yang" loadingpost spin style={Actheme.style('fs:s35 c:lightgray')} />}
        key={width}
        initialNumToRender={4}
        maxToRenderPerBatch={3}
        windowSize={4}
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
  Container: ['SafeAreaView', 'f:1 bg:#F2F2F2'],
  Content: ['FlatList', ['f:1', {
    contentContainerStyle: Actheme.style('ai,jc:c ph:s5 pb:s15')}]],
  Text: ['Text', 'fs,mb:s6 ta:c', {
    small: 'fs:s3'}],
  Wrap: ['View', 'w:100% ai:c']
})