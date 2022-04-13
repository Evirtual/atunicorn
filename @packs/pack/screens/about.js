import React, { useState } from 'react'
import { Comps, Elems, Actheme } from 'pack'
import Markdown from 'markdown-to-jsx';

export default function AboutScreen(props) {

  const { user, users, mode, setMode, router, path, urlId, profileId } = props

  const profile = users?.find(item => item.id === urlId) || {}

  const aboutProfilePath = `/profile/${profileId || urlId}/about/`

  const [edit, setEdit] = useState()
  const [changeNav, setChangeNav] = useState()

  const handleNav = (e) => {
    const scrolled = e.nativeEvent.contentOffset.y
    scrolled > 264
      ? setChangeNav(true)
      : setChangeNav(false)
  }

  return (
    <About.Container mode={mode}>
      <Comps.Meta
        title={path === aboutProfilePath ? (profile?.username || urlId) : "unicorn"}
        desc="about"
        url={path === aboutProfilePath && `https://atunicorn.io/profile/${profileId || profile?.id || urlId}`}
        cover={path === aboutProfilePath && profile.url} />
      <About.ScrollView
        onScroll={!mode && handleNav}
        scrollEventThrottle={1}
        stickyHeaderIndices={!mode && [0]}
        contentContainerStyle={Actheme.style(`jc,ai:c ${!mode ? 'pt:s66' : 'fg:1 pt:s2.5'}`)}
      >
        {!mode && <Comps.Nav changeNav={changeNav} />}

        <About.Wrap mode={mode}>
          <About.Options>
            {user && user?.id === ( profileId || profile?.id || urlId ) && 
              <Elems.Button
                option
                regular
                icon="pencil"
                onPress={() => setEdit(true)} />
            }
            {mode &&
              <Elems.Button
                option
                close
                icon="times"
                onPress={() => (
                  setMode(!mode),
                  router.back()
                )}
                style={Actheme.style('ml:s1')} />
            }
            </About.Options>
          {profile?.about
            ? <About.Text>
                <Markdown>
                  {profile?.about}
                 </Markdown>
              </About.Text>
            : <Comps.Placeholder
                title={
                  (profile?.id || path === aboutProfilePath && urlId)
                    ? `Welcome @${profile?.username || urlId}`
                    : 'Welcome @unicorn'}
                desc={
                  (profile?.id || path === aboutProfilePath && urlId)
                    ? `This is\n@${profile?.username || urlId}\nabout section`
                    : 'It\'s a place to express\nyour uniqueness\n\n' +
                      'in ways that inspire us\nto feel more confident\nIn our everyday life\n\n' +
                      '<p>*****</p>' +
                      'Inspired by' +
                      '<div>' +
                      '<span style="text-decoration:underline">' +
                      '**[Unicorn Art](https://dribbble.com/shots/4409254-Scenarium-icons-vol-9)**' +
                      '</span>' +
                      '</div>' +
                      '<br>' +
                      'Developed using\n' +
                      '<div>' +
                      '<span style="text-decoration:underline; margin:5px;">**[Next.js](https://nextjs.org/)**</span>' +
                      '<span style="text-decoration:underline; margin:5px;">**[React](https://reactjs.org/)**</span>' +
                      '<span style="text-decoration:underline; margin:5px;">**[React Native](https://reactnative.dev/)**</span>' +
                      '</div>' +
                      '<div>' +
                      '<span style="text-decoration:underline; margin:5px;">**[Firebase](https://firebase.google.com/)**</span>' +
                      '<span style="text-decoration:underline; margin:5px;">**[Actheme](https://github.com/egislook/actheme)**</span>' +
                      '<span style="text-decoration:underline; margin:5px;">**[Actstore](https://github.com/egislook/actstore)**</span>' +
                      '</div>' +
                      '<br>'
                } />
          }
        </About.Wrap>
      </About.ScrollView>

      {edit && 
        <Comps.About 
          profile={profile} 
          onClose={() => setEdit(false)} />
      }
      
    </About.Container>
  )
}

const About = Actheme.create({
  Container: ['View', 'f:1 bg:grey', {
    mode: 'ps:fixed t,b,l,r:0 z:10 bg:black400'
  }],
  ScrollView: ['ScrollView', ['f:1']],
  Wrap: ['View', 'bg:white br:s5 w:90vw nh,xw:s95 ai,jc:c bw:1 bc:grey mt:s2.5 mh:s5 mb:s22.5', {
    mode: 'mb:s5'
  }],
  Text: ['Text', 'fs:s4 pv:s2 ph:s5 c:black400'],
  Options: ['View', 'fd:row ps:ab t,r:s1.5 ai,jc:c z:3'],
})