import React from 'react'
import { Comps, Elems, Actheme } from 'pack'
import Actstore from 'actstore'

export default function AboutScreen() {
  const { store, handle, act } = Actstore({}, ['user', 'posts'])
  const router = handle.useRouter()
  const { id } = router?.query || {}
  const [focus, setFocus] = React.useState()
  const { user, users } = store.get('user', 'users')
  const profile = users?.find(item => item.id === id) || {}
  const [about, setAbout] = React.useState()
  const [editAbout, setEditAbout] = React.useState()

  return (<About.Container>
    <About.Content>
      <Comps.Nav />
      <About.Wrap about={profile.about && !editAbout}>
        {profile.about && user && id === user.id && !editAbout && <About.Edit>
          <Elems.Button icon="pencil" iconSize="s4" color="white" onPress={() => setEditAbout(!editAbout)} />
        </About.Edit>}
        {profile.about && !editAbout
          ? <About.Text>{profile.about}</About.Text>
          : user && id === user.id && !profile.about || editAbout
            ? <About.Form>
                <About.Input
                  focus={focus}
                  defaultValue={profile.about || ''}
                  onChangeText={setAbout}
                  placeholder={profile.about || 'What makes you tick?'}
                  onFocus={() => setFocus(true)}
                  onBlur={() => setFocus(false)} />
              </About.Form>
            : <About.Text>
                {id
                  ? profile.username
                    ? `welcome to @${profile?.username}`
                    : `welcome to @${id}`
                  : 'Welcome to @unicorn'
                }
              </About.Text>
        }
      </About.Wrap>
      {((user && id === user.id && about && !profile.about) || (user && id === user.id && editAbout)) && <About.Save>
        <Elems.Button post onPress={() => act('APP_USER', { about }).then(setEditAbout(false))} text="ready to save?" textColor="white" />
      </About.Save>}
    </About.Content>
  </About.Container>
  )
}

const About = Actheme.create({
  Container: ['View', 'nh:100% f:1 bg:black25'],
  Content: ['ScrollView', ['f:1', { contentContainerStyle: Actheme.style('ai:c fw:wrap w:100% xw:s400 as:c ph:s5 pb:s5'), showsVerticalScrollIndicator: true }]],
  Wrap: ['View', 'bg:white br:s5 w:100% nh,xw:s100 ai,jc:c mt:s5 bw:1 bc:black50', {
    about: 'p:s10'
  }],
  Form: ['View', 'h,w:100%'],
  Save: ['View', 'w:100% xw:s100'],
  Text: ['Text', 'fs:s4 ta:c'],
  Input: ['TextInput', ['c:black fs:s4 p:s5 bg:white200 br:s5 bw:1 bc:ts nh:s100', { multiline: true, numberOfLines:10 }], {
    focus: 'bc:mediumseagreen'
  }],
  Edit: ['View', 'w,h,br:s8 of:hd ps:ab t,r:s2 z:2 bg:black200 ai,jc:c'],
})