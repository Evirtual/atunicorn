import React, { useState, useEffect } from 'react'
import { Actheme, Comps } from 'pack'
import Actstore from 'actstore'

function MainScreen() {
  const { store } = Actstore({}, ['user', 'posts'])
  const { user, users } = store.get('user', 'users')
  const data = store.get('posts') || []
  
  const [posts, setPosts] = useState(data)
  const [mode, setMode] = useState('posts')
  const [login, setLogin] = useState()
  const [changeNav, setChangeNav] = useState()

  useEffect(() => {
    setPosts(data)
  }, [user, mode])

  const renderItem = ({item}) => 
    <Comps.Post
      post={item}
      profile={users?.find(user => user.id === item.userId)} />

  const handleNav = (e) => {
    const scrolled = e.nativeEvent.contentOffset.y
    scrolled > 264
      ? setChangeNav(true)
      : setChangeNav(false)
  }

  return (
    <Main.Container>
      <Comps.Meta />
      <Main.FlatList 
        data={posts}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <Main.Wrap empty>
            <Comps.Placeholder
              flatlist
              icon="yin-yang"
              spin
              title="Balancing" />
          </Main.Wrap>
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
            login={login} 
            setLogin={setLogin} 
            data={data} 
            posts={posts} 
            setPosts={setPosts}
            changeNav={changeNav} />}
      />
      {!user?.emailVerified && login &&
        <Comps.Login onClose={() => setLogin(!login)} />}
      {mode === 'upload' &&
        <Comps.Upload onClose={() => setMode(!mode)} />}
    </Main.Container>
  )
}

export default MainScreen

const Main = Actheme.create({
  Container: ['View', 'f:1 bg:grey'],
  FlatList: ['FlatList', ['f:1', {
    contentContainerStyle: Actheme.style('xw:s300 as:c ai,jc:c pt:s66 pb:s22.5'),
    columnWrapperStyle: Actheme.style('fw:wrap ai,jc:c')}]],
  Wrap: ['View', 'as:c bw:1 bc:black50 br:s5 bg:white of:hd mt:s2.5 w:90vw nh,xw:s90']
})