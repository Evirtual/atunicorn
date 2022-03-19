import React, { useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { Actheme } from '../../theme'
import Elems from '../../elems'
import Actstore from 'actstore'

const Nav = Actheme.create({

  Container: ['View', 'bg:white ps:fixed l,r,t:0 z:99 jc,ai:c bbw:1 bbc:black50'],
  Content: ['View', 'fd:row ai:c jc:sb pv:s3 ph:s5 w:100% xw:s300'],
  Wrap: ['View', 'jc,ai:c', {
    image: 'w,h,br:s10 bg:white of:hd',
    username: 'ml:s3',
    row: 'fd:row',
    left: 'jc:start',
    right: 'jc:end',
    search: 'ps:ab l:s1',
    important: 'ps:ab l,r:0 z:9 ph:s5',
    medium: 'w:33%',
    full: 'w:100%',
    max: 'w:s65'
  }],
  Image: ['Image', 'w,h:s10'],

  Comp: (props) => {
    
    const { data, search, setSearch, setPosts, setMode, setLogin } = props
    const { store, action, handle } = Actstore({}, ['user', 'users'])
    const router = handle.useRouter()
    const { user, users } = store.get('user', 'users')
    const { id } = router?.query || {}
    const profile = users?.find(user => user.id === id)
    const [active, setActive] = useState()
    const path = typeof window !== "undefined" && window.location.pathname
    const homePath = '/'
    const profilePath = `/profile/${id}/`
    const { width } = useWindowDimensions()

    const onSearch = (result) => {

      const filter = data.filter(post => 
        post.username.toLowerCase().includes(result.toLowerCase()) ||
        post.desc.toLowerCase().includes(result.toLowerCase()))
        
      setSearch(result)
      setPosts(filter)
    }

    return (
      <Nav.Container>
        <Nav.Content>
          <Nav.Wrap row left medium={width > 767}>
            <Nav.Wrap image>
              {profile
                ? profile?.url
                  ? <Nav.Image source={profile.url || null} />
                  : <Elems.Icon style={Actheme.style('c:lightgray fs:s20')} icon="user-circle" solid />
                : <Nav.Image source="/static/unicorn-io.gif" />
              }
            </Nav.Wrap>
            {(width > 767) &&
              <Nav.Wrap username>
                {path === profilePath
                  ? <Elems.Button text={`@${profile?.username || profile?.id || id}`} />
                  : <Elems.Link href="/" text="@unicorn" />
                }
              </Nav.Wrap>
            }
          </Nav.Wrap>
          {((width < 768) && active || (width > 767)) && (path === homePath || path === profilePath) &&
            <Nav.Wrap important={active}>
              <Nav.Wrap full={(width < 767)} max={(width > 767)}>
                <Nav.Wrap search>
                  {(width > 767)
                    ? <Elems.Button
                        input
                        icon="search"
                        iconColor="grey"
                        iconSize="s4.5" />
                    : <Elems.Button 
                        input
                        icon="times-circle" 
                        iconColor="grey"
                        iconSize="s5.5"
                        onPress={() => setActive(false)} />
                  }
                </Nav.Wrap>
                <Elems.Input
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
          <Nav.Wrap row right medium={width > 767}>
            {(width < 768) && !active && (path === homePath || path === profilePath) &&
              <Elems.Button
                icon="search"
                iconSize="s5.5"
                onPress={() => setActive(true)} />
            }
            {(path === profilePath && user?.id === (profile?.id || id))
              ? null
              : path !== homePath &&
                <Elems.Button
                  icon="arrow-left"
                  iconSize="s5.5"
                  onPress={() => router.back()} />
            }
            {path !== homePath && 
              <Elems.Link href="/">
                <Elems.Button
                  accessibilityRole="link"
                  icon="home"
                  iconSize="s5.5" />
              </Elems.Link>
            }
            {!user && path === homePath
              ? <Elems.Button
                  icon="user-circle"
                  iconSize="s5.5"
                  onPress={() => setLogin(true)} />
              : user && (path === homePath || (path === profilePath && user?.id === (profile?.id || id))) &&
                <Elems.Button
                  disabled={!user.approved}
                  icon="arrow-circle-up"
                  iconSize="s5.5"
                  iconColor="mediumseagreen"
                  onPress={() => setMode('upload')} />
            }
            <Elems.Link
              href={
                path === profilePath
                  ? `/profile/${profile?.id || id}/about/`
                  : '/about/'
              }
            >
              <Elems.Button
                accessibilityRole="link"
                icon="info-circle"
                iconSize="s5.5" />
            </Elems.Link>
            {user && user?.id === (profile?.id || id) 
              ? <Elems.Button
                  icon="power-off"
                  iconSize="s5.5"
                  onPress={action('APP_LOGOUT')} />
              : user &&
                <Elems.Link href={`/profile/${user?.id}`}>
                  <Elems.Button
                    accessibilityRole="link"
                    icon="user-circle"
                    iconSize="s5.5" />
                </Elems.Link>
            }
          </Nav.Wrap>
        </Nav.Content>
      </Nav.Container>
    )
  }
})

export default Nav.Comp