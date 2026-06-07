import React, { useState, useEffect } from 'react'
import { Actheme, Comps } from 'pack'
import Post from 'pack/screens/post'
import Profile from 'pack/screens/profile'
import About from 'pack/screens/about'
import Actstore from 'pack/store/actstore'
import { buildHomeRoute, normalizePath } from './route-state'

const filterPostsBySearch = (posts, query) => {
  const normalizedQuery = (query || '').trim().toLowerCase()

  if (!normalizedQuery) {
    return posts
  }

  return posts?.filter(post =>
    (post?.username || '').toLowerCase().includes(normalizedQuery) ||
    (post?.desc || '').toLowerCase().includes(normalizedQuery))
}

function MainScreen() {

  const { act, store, handle } = Actstore({}, ['ready', 'user', 'users', 'posts'])
  const { user, users, posts } = store.get('user', 'users', 'posts')

  const router = handle.useRouter()
  const { id, search: routeSearch = '', post: routePostId = false } = router.query || {}
  const path = normalizePath(router.asPath)
  
  const [search, setSearch] = useState(routeSearch)
  const [login, setLogin] = useState()
  const [changeNav, setChangeNav] = useState()

  const [mode, setMode] = useState(false)
  const [postId, setPostId] = useState(false)
  const [profileId, setProfileId] = useState(false)

  const url = path?.replace(/\/$/, '')
  const urlLastId = url?.substring(url.lastIndexOf('/') + 1)

  const aboutPath = '/about/'
  const profilePath = `/profile/${profileId || id || urlLastId}/`
  const profileAboutPath = `/profile/${profileId || id || urlLastId}/about/`

  useEffect(() => {
    path === aboutPath
      ? setMode('about')
      : setMode(false)
  }, [path === aboutPath])

  useEffect(() => {
    setPostId(routePostId || false)
  }, [routePostId])

  useEffect(() => {
    path === '/'
      ? setProfileId(false)
      : (path === profilePath || path === profileAboutPath) &&
        setProfileId(profileId || id || urlLastId)
  }, [path])

  useEffect(() => {
    setSearch(routeSearch)
  }, [routeSearch])

  const handleSearchChange = (value) => {
    const nextSearch = value || ''
    const nextQuery = { ...router.query }

    setSearch(nextSearch)

    if (nextSearch) {
      nextQuery.search = nextSearch
    } else {
      delete nextQuery.search
    }

    router.replace(buildHomeRoute({
      search: nextQuery.search,
      postId: nextQuery.post,
    }), undefined, {
      shallow: true,
      scroll: false
    })
  }

  const handlePostClose = () => {
    const nextQuery = { ...router.query }

    delete nextQuery.post

    setPostId(false)

    router.replace(buildHomeRoute({ search }), undefined, {
      shallow: true,
      scroll: false
    })
  }

  const visiblePosts = filterPostsBySearch(posts, search)

  const renderItem = ({item}) => 
    <Comps.Post
      post={item}
      href={buildHomeRoute({ search, postId: item.id })}
      shallow
      scroll={false}
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
        data={visiblePosts}
        item={renderItem}
        onScroll={handleNav}
        navigation={
          <Comps.Nav
            mode={mode}
            setMode={setMode} 
            login={login} 
            setLogin={setLogin} 
            posts={posts}
            search={search}
            onSearchChange={handleSearchChange}
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
            onClose={handlePostClose}
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