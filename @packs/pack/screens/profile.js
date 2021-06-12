import React from 'react'
import { Elems, Actheme } from 'pack'
import Actstore from 'actstore'

export default function ProfileScreen(props) {
  const { store, action, act, handle } = Actstore({}, ['user', 'posts'])
  const router = handle.useRouter()
  const { id } = router?.query || {}
  const { user, users } = store.get('user', 'users')

  const profile = users?.find(item => item.id === id)
  const posts = (store.get('posts') || []).filter(post => post.userId === id)
  const me = user.id === id


  return (
    <Styled.Wrap>
      <Styled.Text>PROFILE {id} {profile.desc} and we have {posts.length} posts and its {me ? 'My Profile' : 'Random Profile'}</Styled.Text>
      {/* <Elems.Link href="/alternate" fustyle="ta:c">
        Go to Alternate Screen and see heart
      </Elems.Link>
      <Styled.Upload action={action('APP_UPLOAD')} />
      <Styled.Cont>
        <Styled.Button onPress={action('MAIN_COUNT')}>Click Me Please to increase number {store.get('count')}</Styled.Button>
        <Styled.Text small aria-level="2">
          {process.env.name} {process.env.version}
        </Styled.Text>
      </Styled.Cont> */}
    </Styled.Wrap>
  )
}

const Styled = Actheme.create({
  File: 'Upload',
  Touch: ['TouchableOpacity', 'bg:pink'],
  Wrap: 'ai,jc:c fg:1',
  Cont: 'mt:s4',
  Text: ['Text', 'fs,mb:s6 ta:c', { small: 'fs:s3'}],
  Button: 'fs,mb:s6 c:green',
  Upload: props => <Styled.File {...props}>
    <Elems.Icon style={Actheme.style('c:black')} icon="heart"/>
  </Styled.File>
})

const actions = ({ store }) => ({
  MAIN_COUNT: () => store.set({ count: store.get('count') + 2 })
})
