import React, { useEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { Actheme } from '../../theme'
import Elems from '../../elems'
import Placeholder from '../placeholder'
import Actstore from 'pack/store/actstore'
import { buildAboutRoute, buildProfileRoute, createModalIntent, normalizePath, saveModalIntent } from '../../screens/route-state'

const Nav = Actheme.create({

  Container: ['View', 'jc,ai:c w:100vw z:2'],
  Content: ['View', 'ps:ab t:-s60 l,r:0 pv:s3 ph:s5 ai,jc:c', {
    changeNav: 'bg:white fd:row ai:c jc:sb bbw:1 bbc:grey t:-1'
  }],
  Wrap: ['View', 'jc,ai:c', {
    image: 'w,h,br:s25 bg:white mh:s6 mv:s3 bw:2 bc:grey of:hd',
    imageSmall: 'w,h,br:s11 bg:white mh:s2 bw:2 bc:grey of:hd',
    action: 'w:s11 h:s10 mh:s0.5',
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

    const {
      posts,
      setPosts,
      setMode,
      setLogin,
      changeNav = false,
      profileId,
      onProfile,
      search: controlledSearch,
      onSearchChange,
      backHref,
    } = props
    
    const { act, store, action, handle } = Actstore({}, ['user', 'users', 'uploading'])
    const { user, users, uploading } = store.get('user', 'users', 'uploading')

    const router = handle.useRouter()
    const { id } = router?.query || {}

    const resolvedProfileId = profileId || id

    const profile = users?.find(user => user.id === resolvedProfileId)

    const path = normalizePath(router.asPath)
    const homePath = '/'
    const profilePath = resolvedProfileId ? buildProfileRoute(resolvedProfileId) : null
    const postPath = `/post/${profileId || id}/`
    const profileAboutPath = resolvedProfileId ? buildAboutRoute(resolvedProfileId) : null
    const isProfilePath = !!profilePath && path === profilePath
    const isProfileAboutPath = !!profileAboutPath && path === profileAboutPath

    const { width } = useWindowDimensions()
    const [hasHydrated, setHasHydrated] = useState(false)

    const [active, setActive] = useState()
    const [editUsername, setEditUsername] = useState()
    const [username, setUsername] = useState()
    const [search, setSearch] = useState()

    const resolvedSearch = typeof controlledSearch === 'string'
      ? controlledSearch
      : (search || '')

    useEffect(() => {
      setHasHydrated(true)
    }, [])

    useEffect(() => {
      controlledSearch && setActive(true)
    }, [controlledSearch])

    const isWide = hasHydrated && width > 768
    const actionIconSize = 's7.5'
    const actionLinkStyle = {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
    const handleBack = () => {
      setMode && setMode(null)
      router.back()
    }

    const handleSearch = (result) => {
      const nextSearch = result || ''

      if (typeof onSearchChange === 'function') {
        onSearchChange(nextSearch)
        return
      }

      const filter = posts?.filter(post =>
        (post?.username || '').toLowerCase().includes(nextSearch.toLowerCase()) ||
        (post?.desc || '').toLowerCase().includes(nextSearch.toLowerCase()))

      setSearch(nextSearch)
      setPosts(filter)
    }

    const handleAboutOpen = () => {
      if (isProfilePath && resolvedProfileId) {
        saveModalIntent(buildAboutRoute(profile?.id || resolvedProfileId), createModalIntent({
          kind: 'about',
          ownerPath: buildProfileRoute(profile?.id || resolvedProfileId)
        }))
      }

      setMode && setMode('about')
    }

    return (
      <Nav.Container>
        <Nav.Content changeNav={changeNav}>
          {changeNav && 
            <Nav.Wrap 
              row 
              left={changeNav} 
              medium={isWide}
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
              {isWide &&
                <Nav.Wrap>
                  {(isProfilePath || isProfileAboutPath) && (profile?.id || user?.id === (profile?.id ||  resolvedProfileId))
                    ? <Elems.Button text={`@${profile?.username || profile?.id || resolvedProfileId}`} />
                    : <Elems.Link href="/" text="@unicorn" />
                  }
                </Nav.Wrap>
              }
            </Nav.Wrap>
          }
          {(active || resolvedSearch || (!user && !changeNav && path === homePath)) &&
            <Nav.Wrap 
              important={!changeNav || !isWide}
              medium={changeNav && isWide}
            >
              <Nav.Wrap 
                search
                max={isWide || !changeNav}
              >
                <Nav.Wrap option>
                  {!resolvedSearch && !active && !changeNav
                    ? <Elems.Button
                        input
                        icon="search"
                        iconColor="black200"
                        iconSize="s4.5" />
                    : <Elems.Button
                        input
                        icon="times-circle"
                        iconSize="s6"
                        onPress={() => resolvedSearch ? handleSearch('') : setActive(false)} />
                  }
                </Nav.Wrap>
                <Elems.Input
                  style={Actheme.style(`ph:s10 ${changeNav && 'bg:grey'}`)}
                  placeholder={
                    (profile?.id || resolvedProfileId)
                      ? `Search @${profile?.username || profile?.id || resolvedProfileId}`
                      : 'Search @unicorn'
                  }
                  onChange={(e) => handleSearch(e.target.value)}
                  value={resolvedSearch} />
              </Nav.Wrap>
            </Nav.Wrap>
          }
          <Nav.Wrap 
            row 
            right={changeNav} 
            medium={changeNav && isWide}
          >
            {changeNav && path !== homePath &&
              <Nav.Wrap action>
                {backHref
                  ? <Elems.Link
                      href={backHref}
                      onClick={() => setMode && setMode(null)}
                      style={actionLinkStyle}
                    >
                      <Elems.Icon
                        icon="arrow-circle-left"
                        iconSize={actionIconSize}
                        iconColor="black" />
                    </Elems.Link>
                  : <Elems.Button
                      icon="arrow-circle-left"
                      iconSize={actionIconSize}
                      iconColor="black"
                      onPress={handleBack} />
                }
              </Nav.Wrap>
            }
            {path !== homePath &&
              <Nav.Wrap action>
                <Elems.Link href="/" style={actionLinkStyle}>
                  <Elems.Icon
                    icon="home"
                    iconSize={actionIconSize}
                    iconColor="black" />
                </Elems.Link>
              </Nav.Wrap>
            }
            {(path === homePath || isProfilePath) &&
              <Nav.Wrap action>
                <Elems.Button
                  icon="search"
                  iconSize={actionIconSize}
                  onPress={() => setActive(true)} />
              </Nav.Wrap>
            }
            {changeNav && !user && path === homePath
              ? <Nav.Wrap action>
                  <Elems.Button
                    icon="user-circle"
                    iconSize={actionIconSize}
                    onPress={() => setLogin(true)} />
                </Nav.Wrap>
              : changeNav && user && (path === homePath || (isProfilePath && user?.id === (profile?.id))) &&
                <Nav.Wrap action>
                  <Elems.Button
                    disabled={!user.approved}
                    icon="arrow-circle-up"
                    iconSize={actionIconSize}
                    iconColor="mediumseagreen"
                    onPress={() => setMode('upload')} />
                </Nav.Wrap>
            }
            {changeNav && path !== postPath &&
              <Nav.Wrap action>
                <Elems.Link
                  href={
                    (isProfilePath || isProfileAboutPath)
                      ? buildAboutRoute(profile?.id || resolvedProfileId)
                      : '/about/'
                  }
                  onClick={handleAboutOpen}
                  style={actionLinkStyle}
                >
                  <Elems.Icon
                    icon="info-circle"
                    iconSize={actionIconSize}
                    iconColor="black" />
                </Elems.Link>
              </Nav.Wrap>
            }
            {user && user?.id === (profile?.id || resolvedProfileId)
              ? <Nav.Wrap action>
                  <Elems.Button
                    icon="power-off"
                    iconSize={actionIconSize}
                    onPress={action('APP_LOGOUT')} />
                </Nav.Wrap>
              : user && path === '/' &&
                <Nav.Wrap action>
                  <Elems.Link
                  href={buildProfileRoute(user?.id || resolvedProfileId)}
                  onClick={onProfile}
                  style={actionLinkStyle}>
                    {user?.url
                      ? <Nav.Wrap user>
                          <Nav.Image source={user?.url || null} />
                        </Nav.Wrap>
                      : <Elems.Icon
                        icon="user-circle"
                        iconSize={actionIconSize}
                        iconColor="black" />
                    }
                  </Elems.Link>
                </Nav.Wrap>
            }
          </Nav.Wrap>
          {!changeNav && 
            <Nav.Wrap row>
              {!user && path === homePath
                ? <Elems.Button
                    text="Login"
                    onPress={() => setLogin(true)} />
                :  user && (path === homePath || (isProfilePath && user?.id === (profile?.id ||  resolvedProfileId)))
                  ? <Elems.Button
                      disabled={!user.approved}
                      text="Upload"
                      textColor="mediumseagreen"
                      onPress={() => setMode('upload')} />
                    : backHref
                    ? <Elems.Link
                      href={backHref}
                      onClick={() => setMode && setMode(null)}
                      text="Back" />
                    : <Elems.Button
                      text="Back"
                      textColor="black"
                      onPress={handleBack} />
              }
              <Nav.Wrap image>
                {user && user?.id === (profile?.id ||  resolvedProfileId)
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
                  (isProfilePath || isProfileAboutPath)
                    ? buildAboutRoute(profileId || profile?.id || resolvedProfileId)
                    : '/about/'
                }
                onClick={handleAboutOpen}
                text="About" />
            </Nav.Wrap>
          }
          {!changeNav && 
            <Nav.Wrap row>
              {user && user?.id === (profile?.id || resolvedProfileId)
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
