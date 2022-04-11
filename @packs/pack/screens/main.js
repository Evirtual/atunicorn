import React, { useState, useEffect } from 'react'
import { Actheme, Comps } from 'pack'

function MainScreen(props) {

  const { user, users, posts, mode, setMode, postId, setPostId, path, urlId } = props

  const aboutPath = '/about/'
  const postPath = `/post/${postId || urlId}/`
  
  const [loadPosts, setLoadPosts] = useState(posts)
  const [login, setLogin] = useState()
  const [changeNav, setChangeNav] = useState()

  useEffect(() => {
    path === aboutPath 
      ? setMode('about')
      : setMode(false)
  }, [path === aboutPath])

  useEffect(() => {
    path === postPath 
      ? setPostId(postId || urlId)
      : setPostId(false)
  }, [path === postPath])

  useEffect(() => {
    setLoadPosts(posts)
  }, [user, mode])

  const renderItem = ({item}) => 
    <Comps.Post
      post={item}
      onClick={() => setPostId(item.id)}
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
        data={loadPosts}
        item={renderItem}
        onScroll={handleNav}
        navigation={
          <Comps.Nav
            mode={mode}
            setMode={setMode} 
            login={login} 
            setLogin={setLogin} 
            posts={posts}
            setPosts={setLoadPosts}
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

    </Main.Container>
  )
}

export default MainScreen

const Main = Actheme.create({
  Container: ['View', 'f:1 bg:grey']
})