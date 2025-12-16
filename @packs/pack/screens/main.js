import React, { useState, useEffect } from 'react'
import { Actheme, Comps } from 'pack'
import Post from 'pack/screens/post'
import Profile from 'pack/screens/profile'
import About from 'pack/screens/about'
import Actstore from 'pack/store/actstore'

function MainScreen() {

  const { act, store, handle } = Actstore({}, ['ready', 'user', 'users', 'posts'])
  const { user, users, posts } = store.get('user', 'users', 'posts')

  const router = handle.useRouter()
  const { id } = router.query || {}
  const path = router.asPath || null
  
  const [loadPosts, setLoadPosts] = useState(posts)
  const [login, setLogin] = useState()
  const [changeNav, setChangeNav] = useState()

  const [mode, setMode] = useState(false)
  const [postId, setPostId] = useState(false)
  const [profileId, setProfileId] = useState(false)

  const url = path?.replace(/\/$/, '')
  const urlLastId = url?.substring(url.lastIndexOf('/') + 1)

  const aboutPath = '/about/'
  const postPath = `/post/${postId || id || urlLastId}/`
  const profilePath = `/profile/${profileId || id || urlLastId}/`
  const profileAboutPath = `/profile/${profileId || id || urlLastId}/about/`

  useEffect(() => {
    path === aboutPath
      ? setMode('about')
      : setMode(false)
  }, [path === aboutPath])

  useEffect(() => {
    path === postPath 
      ? setPostId(postId || id || !profileId && urlLastId)
      : setPostId(false)
  }, [path === postPath])

  useEffect(() => {
    path === '/'
      ? setProfileId(false)
      : (path === profilePath || path === profileAboutPath) &&
        setProfileId(profileId || id || urlLastId)
  }, [path])

  useEffect(() => {
    setLoadPosts(posts)
  }, [posts, user, mode, path])

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
      {(!mode || !postId || !profileId) && 
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
            onProfile={() => setProfileId(user?.id)}
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
        <Comps.Login onClose={() => setLogin(false)} />
        }

      {mode === 'upload' &&
        <Comps.Upload onClose={() => setMode(false)} />
        }

      {mode === 'about' &&
        <About 
          act={act}
          store={store}
          router={router}
          path={path}
          id={id}
          user={user}
          users={users}
          mode={mode} 
          setMode={setMode} />
      }
      
      {postId && 
        <Post 
          act={act}
          postId={postId}
          id={id}
          user={user}
          users={users}
          posts={posts}
          router={router}
          path={path}
          setPostId={setPostId}
          setProfileId={setProfileId}
          mode={mode} 
          setMode={setMode} />
      }

      {profileId && 
        <Profile 
          user={user}
          users={users}
          id={id}
          posts={posts}
          profileId={profileId}
          setProfileId={setProfileId}
          mode={mode} 
          setMode={setMode} />
      }

    </Main.Container>
  )
}

export default MainScreen

const Main = Actheme.create({
  Container: ['View', 'f:1 bg:grey']
})