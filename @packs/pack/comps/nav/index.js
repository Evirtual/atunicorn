import React, { useState } from 'react'
import { Actheme } from '../../theme'
import Elems from '../../elems'
import Actstore from 'actstore'

const Nav = Actheme.create({

  Container: ['View', 'w:100% jc,ai:c z:2 mb:s5'],
  Wrap: ['View', 'jc,ai:c', {
    image: 'w,h,br:s25 bg:white of:hd mh:s6 mt:s4 mb:s3',
    row: 'fd:row',
    user: 'ps:ab z:2',
    search: 'ps:ab l:-s2',
    save: 'ps:ab r:-s2',
    max: 'w:s65'
  }],
  Image: ['Image', 'w,h:s25'],
  File: 'Upload',
  Touch: ['TouchableOpacity', 'w,h,br:s25 jc,ai:c bg:white200 br:s5 of:hd'],
  Text: ['Text', 'ta:c c:lightgray w:100% fs:s2.5 fb:bold mt:s1'],

  Comp: (props) => {
    
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
    
    const onSearch = (result) => {

      const filter = props.data.filter(post => 
        post.username.toLowerCase().includes(result.toLowerCase()) ||
        post.desc.toLowerCase().includes(result.toLowerCase()))

      setSearch(result)
      props.setSearch(result)
      props.setPosts(filter)
    }

    return (
      <Nav.Container>
        <Nav.Wrap row>
          {user && (path === homePath || path === profilePath) &&
            <Elems.Button
              icon="search"
              iconSize="s5.5"
              onPress={() => setActive(true)} />
          }
          {(!user || active) && (path === homePath || path === profilePath) &&
            <Nav.Wrap user={user} max>
              <Nav.Wrap search>
                {!user
                  ? <Elems.Button
                      icon="search"
                      iconColor="grey"
                      iconSize="s4.5" />
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
                value={search || props.search || ''}
                style={Actheme.style('pl:s10')} />
            </Nav.Wrap>
          }
          {(user || path !== homePath && path !== profilePath) && 
            <Elems.Link href="/">
              <Elems.Button
                accessibilityRole="link"
                icon="home"
                iconSize="s5.5" />
            </Elems.Link>
          }
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
        <Nav.Wrap row>
          {!user && path === homePath
            ? <Elems.Button
                text="Login"
                onPress={() => props.setLogin(true)} />
            :  user && (path === homePath || path === profilePath)
              ? <Elems.Button
                  disabled={!user.approved}
                  text="Upload"
                  textColor="mediumseagreen"
                  onPress={() => props.setMode('upload')} />
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
                          <Elems.Icon style={Actheme.style('c:lightgray fs:s10')} icon="yin-yang" spin />
                          <Nav.Text>Uploading</Nav.Text>
                        </>
                      : profile?.url
                        ? <Nav.Image source={profile.url || null} />
                        : <Elems.Icon style={Actheme.style('c:lightgray fs:s10')} icon="camera" solid />
                    }
                  </Nav.Touch>
                </Nav.File>
              : profile
                ? profile?.url
                  ? <Nav.Image source={profile.url || null} />
                  : <Elems.Icon style={Actheme.style('c:lightgray fs:s20')} icon="user-circle" solid />
                : <Nav.Image source="/static/unicorn-io.gif" />
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
        <Nav.Wrap row>
          {user && user?.id === (profile?.id || id)
            ? editUsername || !profile?.username 
              ? <Nav.Wrap row max>
                  <Nav.Wrap search>
                    <Elems.Button
                      icon="times-circle"
                      iconColor="grey"
                      iconSize="s5"
                      onPress={() => setEditUsername(false)} />
                  </Nav.Wrap>
                  <Elems.Input
                    defaultValue={profile?.username || ''}
                    onChangeText={setUsername}
                    placeholder={profile?.username || "Set username"} />
                  {username && 
                    <Nav.Wrap save>
                      <Elems.Button
                        icon="save"
                        iconColor="mediumseagreen"
                        iconSize="s5"
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
        </Nav.Wrap>
      </Nav.Container>
    )
  }
})

export default Nav.Comp