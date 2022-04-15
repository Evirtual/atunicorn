import React, { useState, useEffect } from 'react'
import { Actheme, Comps } from 'pack'

function MainScreen(props) {

  const { user, users, posts, mode, setMode, postId, setPostId, profileId, setProfileId, path, urlId } = props

  const url = path?.replace(/\/$/, '')
  const urlLastId = url?.substring(url.lastIndexOf('/') + 1)

  const aboutPath = '/about/'
  const postPath = `/post/${postId || urlId || urlLastId}/`
  const profilePath = `/profile/${profileId || urlId || urlLastId}/`
  const profileAboutPath = `/profile/${profileId || urlLastId}/about/`
  
  const [loadPosts, setLoadPosts] = useState(posts)
  const [login, setLogin] = useState()
  const [changeNav, setChangeNav] = useState()

  // console.log(urlLastId, profileId, path, profilePath)

  useEffect(() => {
    path === aboutPath 
      ? setMode('about')
      : setMode(false)
  }, [path === aboutPath])

  useEffect(() => {
    path === postPath 
      ? setPostId(postId || urlId || urlLastId)
      : setPostId(false)
  }, [path === postPath])

  useEffect(() => {
    console.log('whatsup')
    path === profilePath || path === profileAboutPath
      ? setProfileId(profileId || urlLastId)
      : setProfileId(false)
  }, [path === profilePath || path === profileAboutPath || path === postPath])

  useEffect(() => {
    setLoadPosts(posts)
  }, [user, mode])

  const renderItem = ({item}) => 
    <Comps.Post
      post={item}
      onPost={() => setPostId(item.id)}
      profile={users?.find(user => user.id === item.userId)}
      onProfile={() => setProfileId(item.userId)} />

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