import React, { useState, useEffect } from 'react'
import { Actheme, Comps } from 'pack'
import Post from 'pack/screens/post'
import Profile from 'pack/screens/profile'
import About from 'pack/screens/about'

function MainScreen(props) {

  const { act, store, user, users, posts, path, router, urlId } = props
  
  const [loadPosts, setLoadPosts] = useState(posts)
  const [login, setLogin] = useState()
  const [changeNav, setChangeNav] = useState()

  const [mode, setMode] = useState(false)
  const [postId, setPostId] = useState(false)
  const [profileId, setProfileId] = useState(false)

  const url = path?.replace(/\/$/, '')
  const urlLastId = url?.substring(url.lastIndexOf('/') + 1)

  const aboutPath = '/about/'
  const postPath = `/post/${postId || urlId || urlLastId}/`
  const profilePath = `/profile/${profileId || urlId || urlLastId}/`
  const profileAboutPath = `/profile/${profileId || urlId || urlLastId}/about/`

  useEffect(() => {
    path === aboutPath
      ? setMode('about')
      : setMode(false)
  }, [path === aboutPath])

  useEffect(() => {
    path === postPath 
      ? setPostId(postId || urlId || !profileId && urlLastId)
      : setPostId(false)
  }, [path === postPath])

  useEffect(() => {
    path === '/'
      ? setProfileId(false)
      : (path === profilePath || path === profileAboutPath) &&
        setProfileId(profileId || urlId || urlLastId)
  }, [path])

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
          urlId={urlId}
          user={user}
          users={users}
          mode={mode} 
          setMode={setMode} />
      }
      
      {postId && 
        <Post 
          act={act}
          postId={postId}
          urlId={urlId}
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
          urlId={urlId}
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