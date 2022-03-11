import React, { useState, useEffect } from 'react'
import { useWindowDimensions } from 'react-native'
import { Actheme, Elems, Comps } from 'pack'
import Actstore from 'actstore'

function MainScreen() {
  const { store, handle } = Actstore({}, ['user', 'posts'])
  const router = handle.useRouter()
  const {user, users } = store.get('user', 'users')
  const [ mode, setMode ] = useState('posts')
  const [login, setLogin] = useState()
  const { id } = router?.query || {}
  const data = store.get('posts') || []
  const [posts, setPosts] = useState(data)
  const { width } = useWindowDimensions()

  useEffect(() => {setPosts(data)}, [user, mode])

  typeof window !== "undefined"
    ? login || mode == 'upload'
      ? document.body.style.overflow = 'hidden'
      : document.body.style.overflow = 'visible'
    : null

  const renderItem = ({item}) => 
    <Comps.Post id={id}
      post={item}
      user={user}
      profile={users?.find(i => i.id === item.userId)}
      onDelete={() => setMode(!mode)} />

  return (
    <Main.Container>
      {!user?.emailVerified && login && <Comps.Login onClose={() => setLogin(!login)} />}
      {mode === 'upload' && <Comps.Upload disabled={!user || !user.approved} onClose={() => setMode(!mode)} />}
      <Main.Content 
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={<Elems.Button icon="yin-yang" loadingpost spin style={Actheme.style('fs:s30 c:lightgray')} />}
        key={width}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={6}
        numColumns={(width < 768 ) ? 1 : (width < 1280) ? 2 : 3 }
        ListHeaderComponent={
          <Comps.Nav
            mode={mode}
            setMode={setMode} 
            login={login} 
            setLogin={setLogin} 
            data={data} 
            posts={posts} 
            setPosts={setPosts} />}
      />
    </Main.Container>
  )
}

export default MainScreen

const Main = Actheme.create({
  Container: ['View', 'f:1 bg:#F2F2F2'],
  Content: ['FlatList', ['f:1', {
    contentContainerStyle: Actheme.style('ai,jc:c ph:s5 pv:s10')}]],
  Wrap: ['View', 'w:100% ai:c']
})