import React from 'react'
import { Comps, Elems, Actheme } from 'pack'
import Actstore from 'actstore'

export default function AboutScreen() {
  const { store, handle, act } = Actstore({}, ['user', 'posts'])
  const router = handle.useRouter()
  const { id } = router?.query || {}
  const { user, users } = store.get('user', 'users')
  const profile = users?.find(item => item.id === id) || {}
  const [about, setAbout] = React.useState()
  const [editAbout, setEditAbout] = React.useState()

  return (
    <About.Container>
      <About.Content>
        <Comps.Nav />
        <About.Wrap about={!editAbout}>
          {profile.about && user && id === user.id && !editAbout && 
            <About.Edit>
              <Elems.Button
                icon="pencil"
                iconSize="s4"
                color="white"
                onPress={() => setEditAbout(!editAbout)} />
            </About.Edit>
          }
          {profile.about && !editAbout
            ? <About.Text>{profile.about}</About.Text>
            : user && id === user.id && !profile.about || editAbout
              ? <About.Form>
                  <Elems.Input
                    multiline
                    numberOfLine={10}
                    defaultValue={profile.about || ''}
                    onChangeText={setAbout}
                    placeholder={profile.about || 'What makes you tick?'}
                    style={Actheme.style(`nh:s100 ${editAbout && 'bc:ts'}`)} />
                </About.Form>
              : <About.Text>
                  {id
                    ? profile.username
                      ? `Welcome to @${profile?.username}`
                      : `Welcome to @${id}`
                    : "Welcome to @unicorn\n\nIt's a place to express\nyour uniqueness\n\nin ways that inspire us\nto feel more confident\nin our everyday life"
                  }
                </About.Text>
          }
        </About.Wrap>
        {((user && id === user.id && about && !profile.about) || (user && id === user.id && editAbout)) &&
          <About.Save>
            <Elems.Button
              submit onPress={() => act('APP_USER', { about }).then(setEditAbout(false))}
              text="Ready to save?" />
          </About.Save>
        }
      </About.Content>
    </About.Container>
  )
}

const About = Actheme.create({
  Container: ['View', 'f:1 bg:#F2F2F2'],
  Content: ['ScrollView', ['f:1', {
    contentContainerStyle: Actheme.style('ai:c fw:wrap w:100% xw:s400 as:c ph:s5 pb:s15'),
    showsVerticalScrollIndicator: true }]],
  Wrap: ['View', 'bg:white br:s5 w:100% nh,xw:s100 ai,jc:c mt:s5 bw:1 bc:black50', {
    about: 'p:s10'
  }],
  Form: ['View', 'h,w:100%'],
  Save: ['View', 'w:100% xw:s100'],
  Text: ['Text', 'fs:s4 ta:c'],
  Edit: ['View', 'w,h,br:s8 of:hd ps:ab t,r:s2 z:2 bg:black200 ai,jc:c'],
})