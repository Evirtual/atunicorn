import React from 'react'
import { Comps, Elems, Actheme } from 'pack'
import Actstore from 'actstore'

export default function ProfileScreen() {
  const { store, handle } = Actstore({}, ['user', 'posts'])
  const router = handle.useRouter()
  const { id } = router?.query || {}
  const { user, users } = store.get('user', 'users')
  const [ mode, setMode ] = React.useState()
  const posts = (store.get('posts') || []).filter(post => post.userId === id)

  return (<Profile.Container>
    <Profile.Content>
      <Comps.Nav mode={mode} setMode={setMode} />
      {(mode === 'post' || !posts.length) && <Comps.Upload onClose={() => setMode()} />}
      {!posts
        ? <Elems.Button icon="spinner-third" spin />
        : mode !== 'post' && posts.map((post, index) => <Comps.Post key={index} id={id} post={post} user={user} profile={users?.find(item => item.id === post.userId)} />)}
    </Profile.Content>
  </Profile.Container>
  )
}

const Profile = Actheme.create({
  Container: ['View', 'f:1 bg:black25'],
  Content: ['ScrollView', ['f:1', { contentContainerStyle: Actheme.style('jc:c fd:row fw:wrap w:100% xw:s400 as:c ph:s5'), showsVerticalScrollIndicator: false }]],
  Text: ['Text', 'fs,mb:s6 ta:c', { small: 'fs:s3'}],
})