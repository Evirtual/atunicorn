import React, { useState } from 'react'
import { Comps, Elems, Actheme } from 'pack'
import Actstore from 'actstore'
import Markdown from 'markdown-to-jsx';

export default function AboutScreen() {
  const { store, handle } = Actstore({}, ['user', 'users'])
  const router = handle.useRouter()
  const { id } = router?.query || {}
  const { user, users } = store.get('user', 'users')
  const profile = users?.find(item => item.id === id) || {}
  const path = router.asPath
  const profileAboutPath = `/profile/${id}/about/`

  const [edit, setEdit] = useState()
  const [changeNav, setChangeNav] = useState()

  const handleNav = (e) => {
    const scrolled = e.nativeEvent.contentOffset.y
    scrolled > 264
      ? setChangeNav(true)
      : setChangeNav(false)
  }

  return (
    <About.Container>
      <Comps.Meta
        title={path === profileAboutPath ? (profile?.username || id) : "unicorn"}
        desc="about"
        url={path === profileAboutPath && `https://atunicorn.io/profile/${id}`}
        cover={path === profileAboutPath && profile.url} />
      <About.ScrollView
        onScroll={handleNav}
        scrollEventThrottle={1}
        stickyHeaderIndices={[0]}
      >
        <Comps.Nav changeNav={changeNav} />
        <About.Wrap>
          {user && user?.id === ( profile?.id || id ) && 
            <About.Option>
              <Elems.Button
                option
                regular
                icon="pencil"
                onPress={() => setEdit(true)} />
            </About.Option>
          }
          {profile?.about
            ? <About.Text about>
                <Markdown>
                  {profile?.about}
                 </Markdown>
              </About.Text>
            : <Comps.Placeholder
                title={
                  (profile?.id || id)
                    ? `Welcome @${profile?.username || id}`
                    : 'Welcome @unicorn'}
                desc={
                  (profile?.id || id)
                    ? `This is @${profile?.username || id} about section`
                    : 'It\'s a place to express\nyour uniqueness\n\nin ways that inspire us\nto feel more confident\nIn our everyday life\n\n<p style="text-decoration:underline">**[Unicorn Art](https://dribbble.com/shots/4409254-Scenarium-icons-vol-9)**</p>\n\n<p><span style="text-decoration:underline; margin:5px;">**[Next.js](https://nextjs.org/)**</span>\n\n<span style="text-decoration:underline; margin:5px;">**[React](https://reactjs.org/)**</span>\n\n<span style="text-decoration:underline; margin:5px;">**[React Native](https://reactnative.dev/)**</span></p>\n\n<span style="text-decoration:underline; margin:5px;">**[Firebase](https://firebase.google.com/)**</span>\n\n<span style="text-decoration:underline; margin:5px;">**[Actheme](https://github.com/egislook/actheme)**</span>\n\n<span style="text-decoration:underline; margin:5px;">**[Actstore](https://github.com/egislook/actstore)**</span>'} />
          }
        </About.Wrap>
      </About.ScrollView>
      {edit && <Comps.About profile={profile} onClose={() => setEdit(false)} />}
    </About.Container>
  )
}

const About = Actheme.create({
  Container: ['View', 'f:1 bg:grey'],
  ScrollView: ['ScrollView', ['f:1', {
    contentContainerStyle: Actheme.style('jc,ai:c pt:s66 pb:s22.5')}]],
  Wrap: ['View', 'bg:white br:s5 w:90vw nh,xw:s90 ai,jc:c bw:1 bc:black50 mt:s2.5 mh:s5',{
    about: 'p:s10'
  }],
  Text: ['Text', 'fs:s4 pv:s2 ph:s5 c:black400'],
  Option: ['View', 'ps:ab t,r:s2 ai,jc:c z:3'],
})