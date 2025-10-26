import React, { useState } from 'react'
import { Comps, Elems, Actheme } from 'pack'
import Markdown from 'markdown-to-jsx';

const defaultAboutDescription = [
  "It's a place to express",
  'your uniqueness',
  '',
  'in ways that inspire us',
  'to feel more confident',
  'In our everyday life',
  '',
  '<div style="height:1px;background:#ededed;margin:30px 0;"></div>',
  '',
  'Inspired by',
  '<span style="display:inline-block;text-decoration:underline;margin:5px 0;">**[Unicorn Art](https://dribbble.com/shots/4409254-Scenarium-icons-vol-9)**</span>',
  '',
  'Developed using',
  '<span style="display:inline-block;text-decoration:underline;margin:5px;">**[Next.js](https://nextjs.org/)**</span>',
  '<span style="display:inline-block;text-decoration:underline;margin:5px;">**[React](https://reactjs.org/)**</span>',
  '<span style="display:inline-block;text-decoration:underline;margin:5px;">**[React Native](https://reactnative.dev/)**</span>',
  '<span style="display:inline-block;text-decoration:underline;margin:5px;">**[Firebase](https://firebase.google.com/)**</span>',
  '<span style="display:inline-block;text-decoration:underline;margin:5px;">**[Actheme](https://github.com/egislook/actheme)**</span>',
  '<span style="display:inline-block;text-decoration:underline;margin:5px;">**[React Context](https://react.dev/reference/react/useContext)**</span>',
  ''
].join('\n');

export default function AboutScreen(props) {

  const { user, users, mode, router, path, id, profileId } = props

  const profile = users?.find(item => item.id === (profileId || id)) || {}

  const aboutProfilePath = `/profile/${profileId || id}/about/`

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
        title={path === aboutProfilePath ? (profile?.username || id) : "unicorn"}
        desc="about"
        url={path === aboutProfilePath && `https://atunicorn.io/profile/${profileId || profile?.id || id}`}
        cover={path === aboutProfilePath && profile.url} />
      <About.ScrollView
        onScroll={!mode && handleNav}
        scrollEventThrottle={1}
        stickyHeaderIndices={!mode && [0]}
        contentContainerStyle={Actheme.style(`jc,ai:ctr ${!mode ? 'pt:s66' : 'fg:1 pt:s2.5'}`)}
      >
        {!mode && <Comps.Nav changeNav={changeNav} />}

        <About.Wrap mode={mode}>
          <About.Options>
            {user && user?.id === ( profileId || profile?.id || id ) && 
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
                onPress={() => router.back()}
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
                  (profile?.id || path === aboutProfilePath && id)
                    ? `Welcome @${profile?.username || id}`
                    : 'Welcome @unicorn'}
                desc={
                  (profile?.id || path === aboutProfilePath && id)
                    ? `This is\n@${profile?.username || id}\nabout section`
                    : defaultAboutDescription
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
    mode: 'pos:fixed t,b,l,r:0 z:10 bg:black400'
  }],
  ScrollView: ['ScrollView', ['f:1']],
  Wrap: ['View', 'bg:white br:s5 w:90vw nh,xw:s95 ai,jc:ctr bw:1 bc:grey mt:s2.5 mh:s5 mb:s22.5', {
    mode: 'mb:s5'
  }],
  Text: ['Text', 'fs:s4 pv:s2 ph:s5 c:black400'],
  Options: ['View', 'fd:row pos:ab t,r:s1.5 ai,jc:ctr z:3'],
})