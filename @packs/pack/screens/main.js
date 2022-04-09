import React, { useState, useEffect } from 'react'
import { Actheme, Comps } from 'pack'
import Actstore from 'actstore'
import About from 'pack/screens/about'

function MainScreen() {
  const { store, handle } = Actstore({}, ['user', 'posts'])
  const { user, users } = store.get('user', 'users')

  const router = handle.useRouter()

  const data = store.get('posts') || []
  
  const [posts, setPosts] = useState(data)
  const [mode, setMode] = useState(false)
  const [login, setLogin] = useState()
  const [changeNav, setChangeNav] = useState()

  const path = router.asPath
  const aboutPath = `/about/`

  useEffect(() => {
    path === aboutPath
      ? setMode('about')
      : setMode(false)
  }, [path === aboutPath])

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
      {!mode && 
        <Comps.Meta />
      }
      <Comps.List
        data={posts}
        item={renderItem}
        onScroll={handleNav}
        navigation={
          <Comps.Nav
            mode={mode}
            setMode={setMode} 
            login={login} 
            setLogin={setLogin} 
            data={data} 
            posts={posts} 
            setPosts={setPosts}
            changeNav={changeNav} />
        }
        placeholder={
          <Comps.Placeholder
            flatlist
            icon="yin-yang"
            spin
            title="Balancing" />
        }
      />

      {!user?.emailVerified && login &&
        <Comps.Login onClose={() => setLogin(false)} />}

      {mode === 'upload' &&
        <Comps.Upload onClose={() => setMode(false)} />}

      {mode === 'about' &&
        <About mode={mode} setMode={setMode} />
      }
    </Main.Container>
  )
}

export default MainScreen

const Main = Actheme.create({
  Container: ['View', 'f:1 bg:grey']
})