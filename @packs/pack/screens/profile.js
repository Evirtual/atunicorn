import React, { useEffect, useState } from 'react'
import Actstore from 'pack/store/actstore'
import { Comps, Actheme } from 'pack' 
import Post from 'pack/screens/post'
import About from 'pack/screens/about'
import { buildAboutRoute, buildProfileRoute, createModalIntent, normalizePath, resolveRoutePresentation } from './route-state'
import { useRouteState } from './use-route-state'

export default function ProfileScreen(props) {

  const { profileId, modalIntent: propModalIntent } = props

  const { act, store, handle } = Actstore({}, ['ready', 'user', 'users', 'posts'])
  const { user, users, posts } = store.get('user', 'users', 'posts')

  const router = handle.useRouter()
  const initialProfilePath = buildProfileRoute(profileId || router.query?.id)
  const { currentPath, modalIntent, hasClientPath } = useRouteState({
    router,
    initialPath: initialProfilePath || router.pathname,
    initialModalIntent: propModalIntent,
  })
  const routeParams = new URLSearchParams(currentPath.split('?')[1] || '')
  const { id } = router.query || {}
  const routePostId = router.query?.post || routeParams.get('post') || false
  const path = normalizePath(currentPath)

  const url = path?.replace(/\/$/, '')
  const urlLastId = url?.substring(url.lastIndexOf('/') + 1)
  const resolvedProfileId = profileId || id || urlLastId

  const profile = users?.find(user => user.id === resolvedProfileId) || {}
  const filteredPosts = posts?.filter(post => post.userId === resolvedProfileId)

  const [loadPosts, setLoadPosts] = useState(filteredPosts)
  const [edit, setEdit] = useState()
  const [changeNav, setChangeNav] = useState()

  const [mode, setMode] = useState(false)
  const [postId, setPostId] = useState(false)

  const aboutPath = buildAboutRoute(resolvedProfileId)
  const routePresentation = resolveRoutePresentation({
    path: currentPath,
    profileId: resolvedProfileId,
    postId: routePostId,
    modalIntent,
  })

  useEffect(() => {
    routePresentation.overlay?.kind === 'about'
      ? setMode('about')
      : setMode(false)
  }, [routePresentation.overlay?.kind])

  useEffect(() => {
    setPostId(routePresentation.overlay?.kind === 'post' ? routePostId || false : false)
  }, [routePresentation.overlay?.kind, routePostId])

  useEffect(() => {
    setLoadPosts(filteredPosts)
  }, [posts, resolvedProfileId, mode, edit])

  const handlePostClose = () => {
    setPostId(false)

    router.replace(buildProfileRoute(resolvedProfileId), undefined, {
      shallow: true,
      scroll: false
    })
  }

  const renderItem = ({item}) => 
    <Comps.Post
      id={resolvedProfileId}
      post={item}
      user={user}
      profile={profile}
      profileId={resolvedProfileId}
      href={buildProfileRoute(resolvedProfileId, { postId: item.id })}
      modalIntent={createModalIntent({
        kind: 'post',
        ownerPath: buildProfileRoute(resolvedProfileId)
      })}
      shallow
      scroll={false}
      onPost={() => setPostId(item.id)}
      onEdit={() => setEdit((loadPosts.find(post => String(post.id) === String(item.id))) || {})}
      onRemove={() => setMode(!mode)} />

  const handleNav = (e) => {
    const scrolled = e.nativeEvent.contentOffset.y
    scrolled > 264
      ? setChangeNav(true)
      : setChangeNav(false)
  }

  if (!hasClientPath && path.includes('[')) {
    return (
      <Profile.Container mode="profile-loading">
        <Comps.Placeholder
          flatlist
          icon="yin-yang"
          spin
          title="Balancing" />
      </Profile.Container>
    )
  }

  if (routePresentation.page === 'about' && path === aboutPath) {
    return (
      <About
        act={act}
        store={store}
        router={router}
        path={path}
        id={resolvedProfileId}
        profileId={resolvedProfileId}
        user={user}
        users={users}
      />
    )
  }

  if (routePresentation.page === 'post' && routePostId) {
    return (
      <Post
        act={act}
        id={routePostId}
        user={user}
        users={users}
        posts={posts}
        router={router}
        path={path}
        onClose={() => router.replace(routePresentation.closeHref)}
        profileId={resolvedProfileId}
        mode={false}
        setMode={setMode} />
    )
  }

  return (
    <Profile.Container mode={profile?.username || resolvedProfileId}>
      {(!mode || !postId || resolvedProfileId) &&
        <Comps.Meta
          title={profile?.username || resolvedProfileId}
          desc="profile"
          url={`https://atunicorn.io/profile/${resolvedProfileId}`}
          cover={profile?.url} />
      }
      {(profile?.id || user?.id === resolvedProfileId)
        ? <Comps.List
            data={loadPosts}
            item={renderItem}
            onScroll={handleNav}
            navigation={
              <Comps.Nav
                profileId={resolvedProfileId}
                mode={mode}
                setMode={setMode}
                backHref="/"
                posts={filteredPosts}
                setPosts={setLoadPosts}
                changeNav={changeNav} />
            }
            placeholder={
              <Comps.Placeholder
                flatlist
                icon={user?.id !== resolvedProfileId && 'image-polaroid'}
                title={user && user?.id === resolvedProfileId ? 'Welcome @unicorn' : 'No posts'}
                desc={user && user?.id === resolvedProfileId && 'You can upload profile picture, change nickname/id and edit about section.'}
                disabled={user && !user.approved}
                actionText="Upload"
                actionTextColor="green"
                logo={user && user?.id === resolvedProfileId}
                action={user && user?.id === resolvedProfileId ? () => setMode('upload') : null} />
            }
          />
        : <Profile.ScrollView stickyHeaderIndices={[0]}>
            <Comps.Nav 
              mode={mode}
              setMode={setMode}
              backHref="/"
              changeNav /> 
            <Profile.Content>
              <Profile.Wrap>
                <Comps.Placeholder
                  icon="user-circle"
                  title="Profile doesn't exist" />
              </Profile.Wrap>
            </Profile.Content>
          </Profile.ScrollView>
      }

      {(mode === 'upload' || edit) && 
        <Comps.Upload post={edit} onClose={() => edit ? setEdit(false) : setMode(false)} />
      }

      {mode === 'about' &&
        <About 
          act={act}
          store={store}
          router={router}
          path={path}
          id={resolvedProfileId}
          profileId={resolvedProfileId}
          user={user}
          users={users}
          mode={mode} 
          setMode={setMode} />
      }

      {routePresentation.overlay?.kind === 'post' && routePostId && 
        <Post 
          act={act}
          postId={routePostId}
          id={resolvedProfileId}
          user={user}
          users={users}
          posts={posts}
          router={router}
          path={path}
          onClose={handlePostClose}
          profileId={resolvedProfileId}
          mode={mode} 
          setMode={setMode} />
      }

    </Profile.Container>
  )
}

const Profile = Actheme.create({
  Container: ['View', 'f:1 bg:grey', {
    mode: 'ps:fixed t,b,l,r:0 z:9'
  }],
  ScrollView: ['ScrollView', ['f:1', {
    contentContainerStyle: Actheme.style('fg:1 w:100% ai,jc:c')}]],
  Content: ['View', 'f:1 ai,jc:c mh:s5 mv:s22.5'],
  Wrap: ['View', 'as:c jc,ai:c bw:1 bc:grey br:s5 bg:white of:hd w:90vw nh,xw:s95']
})