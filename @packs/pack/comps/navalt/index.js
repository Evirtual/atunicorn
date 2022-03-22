import React, { useState } from 'react'
import { useWindowDimensions } from 'react-native'
import { Actheme } from '../../theme'
import Elems from '../../elems'
import Actstore from 'actstore'

const Nav = Actheme.create({

  Container: ['View', 'bg:white ps:fixed l,r,t:0 z:99 jc,ai:c bbw:1 bbc:black50'],
  Content: ['View', 'fd:row ai:c jc:sb pv:s3 pr:s3 pl:s5 w:100% xw:s300'],
  Wrap: ['View', 'jc,ai:c', {
    image: 'w,h,br:s10 bg:white mh:s2',
    logo: 'w,h,br:s12',
    row: 'fd:row',
    left: 'jc:start',
    right: 'jc:end',
    search: 'ps:ab l:s1',
    important: 'ps:ab l,r:0 z:9 ph:s5',
    medium: 'w:33%',
    full: 'w:100%',
    max: 'w:s70'
  }],
  Image: ['Image', 'w,h,br:s10', {
    logo: 'w,h:s12',
    user: 'w,h,br:s6.5'
  }],

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
            <Nav.Wrap image logo={!profile?.url}>
              {profile
                ? profile?.url
                  ? <Nav.Image source={profile.url || null} />
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
          {((width < 768) && active || (width > 767)) && (path === homePath || path === profilePath) &&
            <Nav.Wrap important={active}>
              <Nav.Wrap full={(width < 767)} max={(width > 767)}>
                <Nav.Wrap search>
                  {!search && !active
                    ? <Elems.Button
                        input
                        icon="search"
                        iconColor="grey"
                        iconSize="s4.5" />
                    : <Elems.Button 
                        input
                        icon="times-circle"
                        iconSize="s6"
                        onPress={() => search ? onSearch('') : setActive(false)} />
                  }
                </Nav.Wrap>
                <Elems.Input
                  style={Actheme.style('bg:#F2F2F2')}
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
                iconSize="s6.5"
                onPress={() => setActive(true)} />
            }
            {(path === profilePath && user?.id === (profile?.id || id))
              ? null
              : path !== homePath &&
                <Elems.Button
                  icon="arrow-circle-left"
                  iconSize="s7"
                  iconColor="black"
                  onPress={() => router.back()} />
            }
            {path !== homePath && 
              <Elems.Link href="/">
                <Elems.Icon
                  icon="home"
                  iconSize="s7"
                  iconColor="black" />
              </Elems.Link>
            }
            {!user && path === homePath
              ? <Elems.Button
                  icon="user-circle"
                  iconSize="s7"
                  onPress={() => setLogin(true)} />
              : user && (path === homePath || (path === profilePath && user?.id === (profile?.id || id))) &&
                <Elems.Button
                  disabled={!user.approved}
                  icon="arrow-circle-up"
                  iconSize="s7"
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
              <Elems.Icon
                icon="info-circle"
                iconSize="s7"
                iconColor="black" />
            </Elems.Link>
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
        </Nav.Content>
      </Nav.Container>
    )
  }
})

export default Nav.Comp