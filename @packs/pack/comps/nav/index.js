import React, { useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { Actheme } from '../../theme'
import Elems from '../../elems'
import Actstore from 'actstore'

const Nav = Actheme.create({

  Container: ['View', 'jc,ai:c ps:ab t:-1 w:100vw z:2'],
  Content: ['View', 'ps:ab t,l,r:0 pv:s2.5 ph:s5 ai,jc:c bg:grey400', {
    changeNav: 'bg:white fd:row ai:c jc:sb'
  }],
  Wrap: ['View', 'jc,ai:c', {
    image: 'w,h,br:s25 bg:white mh:s6 mv:s3',
    imageSmall: 'w,h,br:s10 bg:white mh:s2',
    logo: 'w,h,br:s12',
    row: 'fd:row',
    user: 'ps:ab z:2',
    left: 'jc:start',
    right: 'jc:end',
    options: 'ps:ab l:s1',
    save: 'ps:ab r:s1',
    important: 'ps:ab t:s3 l,r:0 z:9 ph:s5',
    search: 'nw:s70 w:100%',
    max: 'xw:s70'
  }],
  Image: ['Image', 'w,h,br:s25', {
    logo: 'w,h:s12',
    profile: 'w,h,br:s9',
    user: 'w,h,br:s6.5'
  }],
  File: 'Upload',
  Touch: ['TouchableOpacity', 'w,h,br:s25 jc,ai:c bg:white200 of:hd'],
  Text: ['Text', 'ta:c c:lightgray w:100% fs:s2.5 fb:bold mt:s1'],

  Comp: (props) => {

    const { data, setPosts, setMode, setLogin, changeNav } = props
    const { act, store, action, handle } = Actstore({}, ['user', 'users', 'uploading'])
    const router = handle.useRouter()
    const { user, users, uploading } = store.get('user', 'users', 'uploading')
    const { id } = router?.query || {}
    const profile = users?.find(user => user.id === id)
    const [active, setActive] = useState()
    const [editUsername, setEditUsername] = useState()
    const [username, setUsername] = useState()
    const [search, setSearch] = useState()
    const path = typeof window !== "undefined" && window.location.pathname
    const homePath = '/'
    const profilePath = `/profile/${id}/`
    const { width } = useWindowDimensions()

    const onSearch = (result) => {

      const filter = data.filter(post =>
        (post.username.toLowerCase() || '').includes(result.toLowerCase()) ||
        (post.desc.toLowerCase() || '').includes(result.toLowerCase()))

      setSearch(result)
      setPosts(filter)
    }

    return (
      <Nav.Container>
        <Nav.Content changeNav={changeNav}>
          {changeNav && 
            <Nav.Wrap row left={changeNav}>
              <Nav.Wrap imageSmall={changeNav} logo={!profile?.url}>
                {profile
                  ? profile?.url
                    ? <Nav.Image profile source={profile.url || null} />
                    : <Elems.Icon icon="user-circle" solid iconColor="lightgray" iconSize="s10" />
                  : <Nav.Image logo source="/static/unilogo.gif" />
                }
              </Nav.Wrap>
              {(width > 767) &&
                <Nav.Wrap>
                  {path === profilePath
                    ? <Elems.Button text={`@${profile?.username || profile?.id || id}`} />
                    : <Elems.Link href="/" text="@unicorn" />
                  }
                </Nav.Wrap>
              }
            </Nav.Wrap>
          }
          {(path === homePath || path === profilePath) && (user ? active : !active) &&
            <Nav.Wrap important={user || changeNav}>
              <Nav.Wrap search max={(width > 767) || !changeNav}>
                <Nav.Wrap options>
                  {!search && !active
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
                  style={changeNav && Actheme.style('bg:#F2F2F2')}
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
          <Nav.Wrap row right={changeNav}>
            {changeNav && path !== homePath &&
              <Elems.Button
                icon="arrow-circle-left"
                iconSize="s7"
                iconColor="black"
                onPress={() => router.back()} />
            }
            {changeNav && user?.id === (profile?.id || id) && path === profilePath
              ? null
              : (path !== homePath) &&
                <Elems.Link href="/">
                  <Elems.Icon
                    icon="home"
                    iconSize="s7"
                    iconColor="black" />
                </Elems.Link>
            }
            {user && (path === homePath || path === profilePath) &&
              <Elems.Button
                icon="search"
                iconSize="s6.5"
                onPress={() => setActive(true)} />
            }
            {changeNav && !user && path === homePath
              ? <Elems.Button
                  icon="user-circle"
                  iconSize="s7"
                  onPress={() => setLogin(true)} />
              : changeNav && user && (path === homePath || (path === profilePath && user?.id === (profile?.id || id))) &&
                <Elems.Button
                  disabled={!user.approved}
                  icon="arrow-circle-up"
                  iconSize="s7"
                  iconColor="mediumseagreen"
                  onPress={() => setMode('upload')} />
            }
            {changeNav && 
              <Elems.Link
                href={
                  path === profilePath
                    ? `/profile/${profile?.id || id}/about/`
                    : '/about/'
                }
              >
                <Elems.Icon
                  icon="info-circle"
                  iconSize="s7"
                  iconColor="black" />
              </Elems.Link>
            }
            {user && user?.id === (profile?.id || id)
              ? <Elems.Button
                  icon="power-off"
                  iconSize="s6.5"
                  onPress={action('APP_LOGOUT')} />
              : user &&
                <Elems.Link href={`/profile/${user?.id}`}>
                  {user?.url
                    ? <Nav.Image user source={user?.url || null} />
                    : <Elems.Icon
                      icon="user-circle"
                      iconSize="s7"
                      iconColor="black" />
                  }
                </Elems.Link>
            }
          </Nav.Wrap>
          {!changeNav && <Nav.Wrap row>
            {!user && path === homePath
              ? <Elems.Button
                  text="Login"
                  onPress={() => setLogin(true)} />
              :  user && (path === homePath || path === profilePath)
                ? <Elems.Button
                    disabled={!user.approved}
                    text="Upload"
                    textColor="mediumseagreen"
                    onPress={() => setMode('upload')} />
                :  <Elems.Button
                    text="Back"
                    textColor="black"
                    onPress={() => router.back()} />
            }
            <Nav.Wrap image>
              {user && user?.id === (profile?.id || id)
                ? <Nav.File action={files => act('APP_UPLOAD', files, 'profile').then(url => act('APP_USER', { url }))}>
                    <Nav.Touch>
                      {uploading == 'profile'
                        ? <>
                            <Elems.Icon icon="yin-yang" spin iconColor="lightgray" iconSize="s10" />
                            <Nav.Text>Uploading</Nav.Text>
                          </>
                        : profile?.url
                          ? <Nav.Image source={profile.url || null} />
                          : <Elems.Icon icon="camera" solid iconColor="lightgray" iconSize="s10" />
                      }
                    </Nav.Touch>
                  </Nav.File>
                : profile
                  ? profile?.url
                    ? <Nav.Image source={profile.url || null} />
                    : <Elems.Icon icon="user-circle" solid iconColor="lightgray" iconSize="s20" />
                  : <Nav.Image source="/static/unilogo.gif" />
              }
            </Nav.Wrap>
            <Elems.Link
              href={
                path === profilePath
                  ? `/profile/${profile?.id || id}/about/`
                  : '/about/'
              }
              text="About" />
          </Nav.Wrap>
          }
          {!changeNav && <Nav.Wrap row>
            {user && user?.id === (profile?.id || id)
              ? editUsername || !profile?.username
                ? <Nav.Wrap row max>
                    <Nav.Wrap search>
                      <Elems.Button
                        input
                        icon="times-circle"
                        iconColor="black"
                        iconSize="s6"
                        onPress={() => setEditUsername(false)} />
                    </Nav.Wrap>
                    <Elems.Input
                      defaultValue={profile?.username || ''}
                      onChangeText={setUsername}
                      placeholder={profile?.username || "Set username"} />
                    {username &&
                      <Nav.Wrap save>
                        <Elems.Button
                          input
                          icon="save"
                          iconColor="mediumseagreen"
                          iconSize="s6"
                          onPress={() => act('APP_USER', { username }).then(username => !!username && setEditUsername(false))} />
                      </Nav.Wrap>
                    }
                  </Nav.Wrap>
                : <Elems.Button
                  text={`@${profile?.username || profile?.id || id}`}
                  onPress={() => setEditUsername(true)} />
              : path === profilePath
                ? <Elems.Button text={`@${profile?.username || profile?.id || id}`}  />
                : <Elems.Button text="@unicorn" />
            }
          </Nav.Wrap>}
        </Nav.Content>
      </Nav.Container>
    )
  }
})

export default Nav.Comp
