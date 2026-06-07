import React, { useEffect, useState } from 'react'
import { Actheme, Comps } from 'pack'
import Actstore from 'pack/store/actstore'
import { buildHomeRoute, buildPostRoute } from './route-state'
import { useRouteState } from './use-route-state'

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

  const { store, handle } = Actstore({}, ['ready', 'user', 'users', 'posts'])
  const { user, users, posts } = store.get('user', 'users', 'posts')

  const router = handle.useRouter()
  const { currentPath } = useRouteState({ router })
  const routeParams = new URLSearchParams(currentPath.split('?')[1] || '')
  const routeSearch = router.query?.search || routeParams.get('search') || ''
  
  const [search, setSearch] = useState(routeSearch)
  const [login, setLogin] = useState()
  const [changeNav, setChangeNav] = useState()

  const [mode, setMode] = useState(false)

  useEffect(() => {
    setSearch(routeSearch)
  }, [routeSearch])

  const handleSearchChange = (value) => {
    const nextSearch = value || ''

    setSearch(nextSearch)

    router.replace(buildHomeRoute({
      search: nextSearch,
    }), undefined, {
      shallow: true,
      scroll: false
    })
  }

  const visiblePosts = filterPostsBySearch(posts, search)
  const hasLoadedPosts = Array.isArray(posts)
  const showEmptySearch = hasLoadedPosts && !visiblePosts?.length && !!search.trim()

  const renderItem = ({item}) => 
    <Comps.Post
      post={item}
      href={buildPostRoute(item.id)}
      profile={users?.find(user => user.id === item.userId)}
    />

  const handleNav = (e) => {
    const scrolled = e.nativeEvent.contentOffset.y
    scrolled > 264
      ? setChangeNav(true)
      : setChangeNav(false)
  }

  return (
    <Main.Container>
      <Comps.Meta />
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
            changeNav={changeNav} />
        }
        placeholder={
          <Comps.Placeholder
            flatlist
            icon={showEmptySearch ? 'image-polaroid' : 'yin-yang'}
            spin={!showEmptySearch}
            title={showEmptySearch ? 'No results' : 'Balancing'}
            desc={showEmptySearch ? `No posts matched "${search}".` : undefined} />
        }
      />

      {!user?.emailVerified && login &&
        <Comps.Login onClose={() => setLogin(false)} />
        }

      {mode === 'upload' &&
        <Comps.Upload onClose={() => setMode(false)} />
        }

    </Main.Container>
  )
}

export default MainScreen

const Main = Actheme.create({
  Container: ['View', 'f:1 bg:grey']
})
