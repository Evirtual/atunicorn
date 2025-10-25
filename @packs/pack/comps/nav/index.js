import React, { useEffect, useState } from 'react'
import { Actheme } from '../../theme'
import Elems from '../../elems'
import Placeholder from '../placeholder'
import { useStore } from 'pack/store'

const useWindowSize = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (typeof window !== 'object') return
    const handleResize = () => setDimensions({ width: window.innerWidth, height: window.innerHeight })
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return dimensions
}

const Nav = Actheme.create({

  Container: ['View', 'jc,ai:c w:100vw z:2'],
  Content: ['View', 'ps:ab t:-s60 l,r:0 pv:s3 ph:s5 ai,jc:c', {
    changeNav: 'bg:white fd:row ai:c jc:sb bbw:1 bbc:grey t:-1'
  }],
  Wrap: ['View', 'jc,ai:c', {
    image: 'w,h,br:s25 bg:white mh:s6 mv:s3 bw:2 bc:grey of:hd',
    imageSmall: 'w,h,br:s11 bg:white mh:s2 bw:2 bc:grey of:hd',
    row: 'fd:row',
    user: 'w,h,br:s8 bw:2 bc:black of:hd',
    logo: 'bw:0',
    left: 'jc:start',
    right: 'jc:end',
    option: 'ps:ab l:s1',
    save: 'ps:ab r:s1',
    important: 'ps:ab t:s3 l,r:0 z:9 ph:s5',
    search: 'nw:s65 w:100%',
    max: 'xw:s5',
    medium: 'w:33.33%'
  }],
  Image: ['Image', 'w,h,br:100%'],
  File: 'Upload',
  Touch: ['TouchableOpacity', 'w,h,br:s25 jc,ai:c bg:white of:hd'],

  Comp: (props) => {

  const { posts, setPosts, setMode, setLogin, changeNav = false, profileId, onProfile } = props
    
  const { act, store, action, handle } = useStore()
    const { user, users, uploading } = store.get('user', 'users', 'uploading')

    const router = handle.useRouter()
    const { id } = router?.query || {}

    const profile = users?.find(user => user.id === (profileId || id))

    const path = router.asPath
    const homePath = '/'
    const profilePath = `/profile/${profileId || id}/`
    const postPath = `/post/${profileId || id}/`
    const profileAboutPath = `/profile/${profileId || id}/about/`

  const { width } = useWindowSize()

    const [active, setActive] = useState()
    const [editUsername, setEditUsername] = useState()
    const [username, setUsername] = useState()
    const [search, setSearch] = useState()

    const onSearch = (result) => {
      const filter = posts?.filter(post =>
        (post.username.toLowerCase() || '').includes(result.toLowerCase()) ||
        (post.desc.toLowerCase() || '').includes(result.toLowerCase()))
      setSearch(result)
      setPosts(filter)
    }

    return (
      <Nav.Container>
        <Nav.Content changeNav={changeNav}>
          {changeNav && 
            <Nav.Wrap 
              row 
              left={changeNav} 
              medium={(width > 768)}
            >
              <Nav.Wrap 
                imageSmall={changeNav}
                logo={!profile?.url}
              >
                {profile
                  ? profile?.url
                    ? <Nav.Image
                        source={profile.url || null} />
                    : <Elems.Icon 
                        icon="user-circle"
                        solid
                        iconColor="black100"
                        iconSize="s10" />
                  : <Nav.Image
                      source="/static/unilogo.gif" />
                }
              </Nav.Wrap>
              {(width > 768) &&
                <Nav.Wrap>
                  {(path === profilePath || path === profileAboutPath) && (profile?.id || user?.id === (profile?.id ||  id))
                    ? <Elems.Button text={`@${profile?.username || profile?.id || id}`} />
                    : <Elems.Link href="/" text="@unicorn" />
                  }
                </Nav.Wrap>
              }
            </Nav.Wrap>
          }
          {(active || (!user && !changeNav && path === homePath)) &&
            <Nav.Wrap 
              important={!changeNav || changeNav && (width < 769)}
              medium={changeNav && (width > 768)}
            >
              <Nav.Wrap 
                search
                max={(width > 768) || !changeNav}
              >
                <Nav.Wrap option>
                  {!search && !active && !changeNav
                    ? <Elems.Button
                        input
                        icon="search"
                        iconColor="black200"
                        iconSize="s4.5" />
                    : <Elems.Button
                        input
                        icon="times-circle"
                        iconSize="s6"
                        onPress={() => search ? onSearch('') : setActive(false)} />
                  }
                </Nav.Wrap>
                <Elems.Input
                  style={Actheme.style(`ph:s10 ${changeNav && 'bg:grey'}`)}
                  placeholder={
                    (profile?.id || id)
                      ? `Search @${profile?.username || profile?.id || id}`
                      : 'Search @unicorn'
                  }
                  onChange={(e) => onSearch(e.target.value)}
                  value={search || ''} />
              </Nav.Wrap>
            </Nav.Wrap>
          }
          <Nav.Wrap 
            row 
            right={changeNav} 
            medium={changeNav && (width > 768)}
          >
            {changeNav && path !== homePath &&
              <Elems.Button
                icon="arrow-circle-left"
                iconSize="s7.5"
                iconColor="black"
                onPress={() => router.back()} />
            }
            {path !== homePath &&
              <Elems.Link href="/">
                <Elems.Icon
                  icon="home"
                  iconSize="s7.5"
                  iconColor="black" />
              </Elems.Link>
            }
            {(path === homePath || path === profilePath) &&
              <Elems.Button
                icon="search"
                iconSize="s7"
                onPress={() => setActive(true)} />
            }
            {changeNav && !user && path === homePath
              ? <Elems.Button
                  icon="user-circle"
                  iconSize="s7.5"
                  onPress={() => setLogin(true)} />
              : changeNav && user && (path === homePath || (path === profilePath && user?.id === (profile?.id))) &&
                <Elems.Button
                  disabled={!user.approved}
                  icon="arrow-circle-up"
                  iconSize="s7.5"
                  iconColor="mediumseagreen"
                  onPress={() => setMode('upload')} />
            }
            {changeNav && path !== postPath &&
              <Elems.Link
                href={
                  (path === profilePath) && !profileId
                    ? `/profile/[id]?id=${profile?.id || id}`
                    : '/'
                }
                as={
                  path === profilePath
                    ? `/profile/${profile?.id || id}/about`
                    : '/about/'
                }
                onClick={() => setMode('about')}
              >
                <Elems.Icon
                  icon="info-circle"
                  iconSize="s7.5"
                  iconColor="black" />
              </Elems.Link>
            }
            {user && user?.id === (profile?.id || id)
              ? <Elems.Button
                  icon="power-off"
                  iconSize="s7"
                  onPress={action('APP_LOGOUT')} />
              : user && path === '/' &&
                <Elems.Link
                href={'/'}
                as={ `/profile/${user?.id || id}`}
                onClick={onProfile}>
                  {user?.url
                    ? <Nav.Wrap user>
                        <Nav.Image source={user?.url || null} />
                      </Nav.Wrap>
                    : <Elems.Icon
                      icon="user-circle"
                      iconSize="s7.5"
                      iconColor="black" />
                  }
                </Elems.Link>
            }
          </Nav.Wrap>
          {!changeNav && 
            <Nav.Wrap row>
              {!user && path === homePath
                ? <Elems.Button
                    text="Login"
                    onPress={() => setLogin(true)} />
                :  user && (path === homePath || (path === profilePath && user?.id === (profile?.id ||  id)))
                  ? <Elems.Button
                      disabled={!user.approved}
                      text="Upload"
                      textColor="mediumseagreen"
                      onPress={() => setMode('upload')} />
                  :  <Elems.Button
                      text="Back"
                      textColor="black"
                      onPress={() => (setMode && setMode(null), router.back())} />
              }
              <Nav.Wrap image>
                {user && user?.id === (profile?.id ||  id)
                  ? <Nav.File action={files => act('APP_UPLOAD', files, 'profile').then(url => act('APP_USER', { url }))}>
                      <Nav.Touch>
                          {uploading == 'profile'
                            ? <Placeholder
                                profile
                                icon="yin-yang"
                                spin
                                title="Uploading" />
                            : profile?.url
                              ? <Nav.Image source={profile.url || null} />
                              : <Elems.Icon 
                                  icon="camera"
                                  solid
                                  iconColor="black100"
                                  iconSize="s10" />
                          }
                      </Nav.Touch>
                    </Nav.File>
                  : profile
                    ? profile?.url
                      ? <Nav.Image source={profile.url || null} />
                      : <Elems.Icon 
                          icon="user-circle"
                          solid
                          iconColor="black100"
                          iconSize="s20" />
                    : <Nav.Image source="/static/unilogo.gif" />
                }
              </Nav.Wrap>
              <Elems.Link
                href={
                  (path === profilePath) && !profileId
                    ? `/profile/[id]?id=${profile?.id || id}`
                    : '/'
                }
                as={
                  path === profilePath
                    ? `/profile/${profileId || profile?.id || id}/about`
                    : '/about/'
                }
                onClick={() => setMode('about')}
                text="About" />
            </Nav.Wrap>
          }
          {!changeNav && 
            <Nav.Wrap row>
              {user && user?.id === (profile?.id || profileId || id)
                ? editUsername || !profile?.username
                  ? <Nav.Wrap row search max>
                      <Nav.Wrap option>
                        <Elems.Button
                          input
                          icon="times-circle"
                          iconColor="black"
                          iconSize="s6"
                          onPress={() => setEditUsername(false)}
                          style={Actheme.style('bg:white')}/>
                      </Nav.Wrap>
                      <Elems.Input
                        defaultValue={profile?.username || ''}
                        onChangeText={setUsername}
                        placeholder={profile?.username || "Set username"}
                        style={Actheme.style('ph:s10')} />
                      {username &&
                        <Nav.Wrap save>
                          <Elems.Button
                            input
                            icon="save"
                            iconColor="mediumseagreen"
                            iconSize="s6"
                            style={Actheme.style('bg:white')}
                            onPress={() => act('APP_USER', { username }).then(username => !!username && setEditUsername(false))} />
                        </Nav.Wrap>
                      }
                    </Nav.Wrap>
                  : <Elems.Button
                      text={`@${profile?.username || profile?.id || id}`}
                      onPress={() => setEditUsername(true)} />
                : (path === profilePath || path === `${profilePath}about/`)
                  ? <Elems.Button text={`@${profile?.username || profile?.id || id}`}  />
                  : <Elems.Button text="@unicorn" />
              }
            </Nav.Wrap>
          }
        </Nav.Content>
      </Nav.Container>
    )
  }
})

export default Nav.Comp
