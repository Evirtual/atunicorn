import React, { useState } from 'react'
import { Comps, Elems, Actheme } from 'pack'
import Actstore from 'actstore'

export default function AboutScreen() {
  const { store, handle } = Actstore({}, ['user', 'users'])
  const router = handle.useRouter()
  const { id } = router?.query || {}
  const { user, users } = store.get('user', 'users')
  const profile = users?.find(item => item.id === id) || {}
  const [editAbout, setEditAbout] = useState()

  return (
    <About.Container>
      {editAbout && <Comps.About profile={profile} onClose={() => setEditAbout(false)} />}
      <About.Content>
        <Comps.Nav />
        <About.Wrap>
          {profile.about && user && id === user.id && !editAbout && 
            <About.Edit>
              <Elems.Button
                remove
                icon="pencil"
                iconSize="s3"
                color="white"
                onPress={() => setEditAbout(true)} />
            </About.Edit>
          }
          {profile.about && !editAbout
            ? <About.Text>{profile.about}</About.Text>
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
      </About.Content>
    </About.Container>
  )
}

const About = Actheme.create({
  Container: ['View', 'f:1 bg:#F2F2F2'],
  Content: ['ScrollView', ['f:1', {
    contentContainerStyle: Actheme.style('ai:c w:100% xw:s400 as:c ph:s5 pv:s10')}]],
  Wrap: ['View', 'bg:white br:s5 w:100% nh,xw:s100 ai,jc:c bw:1 bc:black50 mt:s2.5 p:s10'],
  Text: ['Text', 'fs:s4 ta:c'],
  Edit: ['View', 'w,h,br:s8 bg:black200 ps:ab t,r:s2 ai,jc:c z:3'],
})