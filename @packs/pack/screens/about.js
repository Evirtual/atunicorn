import React from 'react'
import { Comps, Elems, Actheme } from 'pack'
import Actstore from 'actstore'

export default function AboutScreen() {
  const { store, handle } = Actstore({}, ['user', 'posts'])
  const router = handle.useRouter()
  const { id } = router?.query || {}
  const { user, users } = store.get('user', 'users')
  const posts = (store.get('posts') || []).filter(post => post.userId === id)
  const profile = users?.find(item => item.id === id) || {}

  return (<About.Container>
    <About.Content>
    <Comps.Nav />
    <About.Wrap>
      <About.Text>{id ? `welcome to @${profile.username || id}` : 'Welcome to @unicorn'}</About.Text>
    </About.Wrap>
    </About.Content>
  </About.Container>
  )
}

const About = Actheme.create({
  Container: ['View', 'f:1 bg:black25'],
  Content: ['ScrollView', ['f:1', { contentContainerStyle: Actheme.style('jc:c fd:row fw:wrap w:100% xw:s400 as:c'), showsVerticalScrollIndicator: false }]],
  Wrap: ['View', 'p:s5 bg:white br:s5 w:100% nh,xw:s100 ai,jc:c m:s5'],
  Text: ['Text', 'fs:s4 ta:c'],
})