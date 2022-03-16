import React, { useState } from 'react'
import { useWindowDimensions } from 'react-native'
import Elems from '../../elems'
import { Actheme } from '../../theme'
import Actstore from 'actstore'

const Nav = Actheme.create({

  Container: ['View', 'bg:white ps:fixed l,r,t:0 z:99 jc,ai:c bbw:1 bbc:black50'],
  Content: ['View', 'fd:row jc:sb ai:c p:s3 w:100% xw:s290'],
  Wrap: ['View', 'jc,ai:c', {
    image: 'w,h,br:s10 bg:white of:hd mr:s2',
    row: 'fd:row w:33.33%',
    left: 'jc:start',
    right: 'jc:end',
    search: 'ps:ab l:-s2',
    important: 'z:9',
    max: 'w:s65'
  }],
  Image: ['Image', 'w,h:s10'],
  Text: ['Text', 'ta:c c:lightgray w:100% fs:s2.5 fb:bold mt:s1'],

  Comp: (props) => {
    
    const { store, action, handle } = Actstore({}, ['user', 'users'])
    const router = handle.useRouter()
    const { user, users } = store.get('user', 'users')
    const { id } = router?.query || {}
    const profile = users?.find(user => user.id === id)
    const [active, setActive] = useState()
    const [search, setSearch] = useState()
    const path = typeof window !== "undefined" && window.location.pathname
    const homePath = '/'
    const profilePath = `/profile/${id}/`
    const { width } = useWindowDimensions()

    const onSearch = (result) => {
      const filter = props.data.filter(post => (post.desc.toLowerCase().includes(result.toLowerCase())))
      props.setPosts(filter)
      setSearch(result)
    }

    return (
      <Nav.Container>
        <Nav.Content>
          <Nav.Wrap row left>
            <Nav.Wrap image>
              {profile
                ? profile?.url
                  ? <Nav.Image source={profile.url || null} />
                  : <Elems.Icon style={Actheme.style('c:lightgray fs:s20')} icon="user-circle" solid />
                : <Nav.Image source="/static/unicorn-io.gif" />
              }
            </Nav.Wrap>
            {(width > 767) &&
              <Nav.Wrap>
                {path === profilePath
                  ? <Elems.Button text={`@${profile?.username || profile?.id || id}`} />
                  : <Elems.Button text="@unicorn" onPress={() => router?.push('/')} />
                }
              </Nav.Wrap>
            }
          </Nav.Wrap>
          <Nav.Wrap row important={active}>
            {((width < 768) && active || (width > 767)) && (path === homePath || path === profilePath) &&
              <Nav.Wrap max>
                <Nav.Wrap search>
                  {(width > 767)
                    ? <Elems.Button
                        icon="search"
                        iconColor="grey" />
                    : <Elems.Button 
                        icon="times-circle" 
                        iconColor="grey"
                        iconSize="s5"
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
                  value={search || ''}
                  style={Actheme.style('pl:s10')} />
              </Nav.Wrap>
            }
          </Nav.Wrap>
          <Nav.Wrap row right>
            {(width < 768) && !active && (path === homePath || path === profilePath) &&
              <Elems.Button
                icon="search"
                iconSize="s5"
                onPress={() => setActive(true)} />
            }
            {path !== homePath && 
              <Elems.Button
                icon="home"
                iconSize="s5"
                onPress={() => router?.push('/')} />
            }
            {!user && path === homePath
              ? <Elems.Button
                  icon="user-circle"
                  iconSize="s5"
                  onPress={() => props.setLogin(true)} />
              : user && (path === homePath || (path === profilePath && user?.id === (profile?.id || id)))
                ? <Elems.Button
                    disabled={!user.approved}
                    icon="arrow-circle-up"
                    iconSize="s5"
                    iconColor="mediumseagreen"
                    onPress={() => props.setMode('upload')} />
                : <Elems.Button
                    icon="arrow-left"
                    iconSize="s5"
                    onPress={() => router.back()} />
            }
            <Elems.Button
              icon="info-circle"
              iconSize="s5"
              style={Actheme.style('nw:auto mh:s4')}
              onPress={() => 
                path === homePath
                  ? router.push('/about/')
                  : path === profilePath
                    ? router.push(`/profile/${profile ? profile.id : id}/about/`)
                    : null
              } />
            {user && user?.id === (profile?.id || id) 
              ? <Elems.Button
                  icon="power-off"
                  iconSize="s5"
                  onPress={action('APP_LOGOUT')} />
              : user &&
                <Elems.Button
                  icon="user-circle"
                  iconSize="s5"
                  onPress={() => router.push('/profile/' + user?.id)} />
            }
          </Nav.Wrap>
        </Nav.Content>
      </Nav.Container>
    )
  }
})

export default Nav.Comp