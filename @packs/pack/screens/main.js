import React, { useState, useEffect } from 'react'
import { Actheme, Elems, Comps } from 'pack'
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

  const handleNavalt = (e) => {
    const scrolled = e.nativeEvent.contentOffset.y
    scrolled > 180
      ? setChangeNav(true)
      : setChangeNav(false)
  }

  return (
    <Main.Container>
      <Comps.Meta />
      <Main.Content 
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
  Container: ['View', 'f:1 bg:#F2F2F2'],
  Content: ['FlatList', ['f:1', {
    contentContainerStyle: Actheme.style('xw:s300 ai,jc:c as:c ph:s5 pt:s5 pb:s10'),
    columnWrapperStyle: Actheme.style('fw:wrap ai,jc:c'),
    ListHeaderComponentStyle: Actheme.style('fw:wrap ai,jc:c mb:s60')}]],
  Wrap: ['View', 'w:100% ai:c']
})