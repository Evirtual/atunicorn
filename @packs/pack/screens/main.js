import React, { useState, useEffect } from 'react'
import { useWindowDimensions } from 'react-native'
import { Actheme, Elems, Comps } from 'pack'
import Actstore from 'actstore'

function MainScreen() {
  const { store } = Actstore({}, ['user', 'posts'])
  const { user, users } = store.get('user', 'users')
  const data = store.get('posts') || []
  const [posts, setPosts] = useState(data)
  const [mode, setMode] = useState('posts')
  const [search, setSearch] = useState()
  const [login, setLogin] = useState()
  const [showNavalt, setShowNavalt] = useState()
  const { width } = useWindowDimensions()

  useEffect(() => {
    setPosts(data)
  }, [user, mode])

  useEffect(() => {
    setShowNavalt(false)
  }, [width])

  const renderItem = ({item}) => 
    <Comps.Post
      post={item}
      profile={users?.find(user => user.id === item.userId)} />

  const handleNavalt = (e) => {
    const scrolled = e.nativeEvent.contentOffset.y
    scrolled > 260 
      ? setShowNavalt(true)
      : setShowNavalt(false)
  }

  return (
    <Main.Container>
      <Comps.Meta />
      {showNavalt &&
        <Comps.Navalt
          mode={mode}
          setMode={setMode} 
          login={login} 
          setLogin={setLogin} 
          data={data} 
          posts={posts} 
          setPosts={setPosts}
          search={search}
          setSearch={setSearch} />
      }
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
        onScroll={handleNavalt}
        numColumns={(width < 768 ) ? 1 : (width < 1280) ? 2 : 3 }
        ListHeaderComponent={
          <Comps.Nav
            mode={mode}
            setMode={setMode} 
            login={login} 
            setLogin={setLogin} 
            data={data} 
            posts={posts} 
            setPosts={setPosts}
            search={search}
            setSearch={setSearch} />}
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