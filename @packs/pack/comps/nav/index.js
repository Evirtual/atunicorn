import React, { useState } from 'react'
import Elems from '../../elems'
import { Actheme } from '../../theme'
import Actstore from 'actstore'

const Nav = Actheme.create({

  Container: ['View', 'w:100% jc,ai:c z:2 p:s10'],
  Wrap: ['View', 'jc,ai:c', {
    image: 'w,h,br:s25 bg:white of:hd mh:s6 mt:s4 mb:s2',
    row: 'fd:row',
    input: 'ps:ab z:2',
    search: 'ps:ab l:-s2',
    save: 'ps:ab r:-s2',
  }],
  Image: ['Image', 'w,h:100%'],
  File: 'Upload',
  Touch: ['TouchableOpacity', 'w,h,br:s25 jc,ai:c bg:white200 br:s5 of:hd'],
  Image: ['Image', 'w,h:s25'],
  Text: ['Text', 'ta:c c:lightgray w:100% fs:s2.5 fb:bold mt:s1'],

  Comp: (props) => {
    const { act, store, action, handle } = Actstore({}, ['user', 'posts', 'uploading'])
    const router = handle.useRouter()
    const { user, users, uploading } = store.get('user', 'users', 'uploading')
    const { id } = router?.query || {}
    const [active, setActive] = React.useState()
    const [editUsername, setEditUsername] = React.useState()
    const [username, setUsername] = React.useState()
    const profile = users?.find(item => item.id === id) || {}
    const path = typeof window !== "undefined" && window.location.pathname
    const [search, setSearch] = useState()

    const onSearch = (result) => {
      const filter = props.data.filter(post => (post.desc.toLowerCase().includes(result.toLowerCase())))
      props.setPosts(filter)
      setSearch(result)
    }

    return (
      <Nav.Container>
        <Nav.Wrap row>
          {user && path !== '/about/' && path !== '/profile/' + id + '/about/' && 
            <Elems.Button
              icon="search"
              iconSize="s5"
              onPress={() => setActive(true)} />
          }
          {(!user || active) && path !== '/about/' && path !== '/profile/' + id + '/about/' &&
            <Nav.Wrap input={user}>
              <Nav.Wrap search>
                { !user
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
                placeholder={path !== '/' && path !== '/about' && !!profile.id 
                  ? `Search @${profile?.username || id}`
                  : 'Search @unicorn'
                }
                onChange={(e) => onSearch(e.target.value)}
                value={search || ''} />
            </Nav.Wrap>
          }
          {(user || path === '/about/' || path === '/profile/' + id + '/about/') && 
            <Elems.Button
              icon="home"
              iconSize="s5"
              onPress={() => router?.push('/')} />
          }
          {user && id !== user.id
            ? <Elems.Button
                icon="user-circle"
                iconSize="s5"
                onPress={() => router.push('/profile/' + user.id)} />
            : user && 
                <Elems.Button
                  icon="power-off"
                  iconSize="s5"
                  onPress={action('APP_LOGOUT')} />
          }
        </Nav.Wrap>
        <Nav.Wrap row>
          {!user && path === '/'
            ? <Elems.Button
                text="Login"
                onPress={() => props.setLogin(!props.login)} />
            : path === '/' || user && id === user.id && (path !== '/profile/' + user.id + '/about/')
              ? <Elems.Button
                  disabled={!user.approved}
                  text={props.mode === 'upload' ? 'Back' : 'Upload'}
                  textColor={props.mode === 'upload' ? 'black' : 'mediumseagreen'}
                  onPress={props.mode === 'upload' ? () => props.setMode('posts') : () => props.setMode('upload')} />
              :  <Elems.Button
                  text="Back"
                  textColor="black"
                  onPress={() => router.back()} />
          }
          <Nav.Wrap image>
            {user && id === user.id
              ? <Nav.File action={files => act('APP_UPLOAD', files, 'profile').then(url => act('APP_USER', { url }))}>
                  <Nav.Touch>
                    {uploading == 'profile'
                        ? <>
                            <Elems.Icon style={Actheme.style('c:lightgray fs:s10')} icon="yin-yang" spin />
                            <Nav.Text>Uploading</Nav.Text>
                          </>
                        : !profile.url
                          ? <Elems.Icon style={Actheme.style('c:lightgray fs:s10')} icon="camera" solid />
                          : <Nav.Image source={profile.url} />
                    }
                  </Nav.Touch>
                </Nav.File>
              : path !== '/' && path !== '/about/' && !profile.url
                ? <Elems.Icon style={Actheme.style('c:lightgray fs:s20')} icon="user-circle" solid />
                : <Nav.Image source={profile.url ? profile.url : '/static/unicorn-io.gif' } />
            }
          </Nav.Wrap>
          <Elems.Button
            text="About"
            onPress={
              path === '/'
                ? () => router.push('/about/')
                : path === '/about/'
                  ? null
                  : () => router.push('/profile/' + id + '/about/')
            } />
        </Nav.Wrap>
        <Nav.Wrap row>
          {!editUsername &&
            <Elems.Button
              text={'@' + (profile.username ? profile.username : id ? id : 'unicorn')}
              onPress={ user && id === user.id ? () => setEditUsername(true) : null} />
          }
          {user && id === user.id && editUsername && <Nav.Wrap row>
            <Nav.Wrap search>
              <Elems.Button
                icon="times-circle"
                iconColor="grey"
                iconSize="s5"
                onPress={() => setEditUsername(false)} />
            </Nav.Wrap>
            <Elems.Input
              defaultValue={profile.username || ''}
              onChangeText={setUsername}
              placeholder={profile.username || "Set username"} />
            <Nav.Wrap save>
              <Elems.Button
                icon="save"
                iconColor="mediumseagreen"
                iconSize="s5"
                onPress={() => act('APP_USER', { username }).then(() => setEditUsername(false))} />
            </Nav.Wrap>
          </Nav.Wrap>}
          {user && id === user.id && !editUsername && !profile.username && path !== '/' &&
            <Elems.Button
              icon="pencil"
              iconSize="s5"
              onPress={() => setEditUsername(true)} />
          }
        </Nav.Wrap>
      </Nav.Container>
    )
  }
})

export default Nav.Comp