import React from 'react'
import { Elems, Actheme } from 'pack'
import Actstore from 'actstore'

export default function PostScreen(props) {
  const { store, action, act, handle } = Actstore({}, ['user', 'posts'])
  const router = handle.useRouter()
  const { id } = router?.query || {}
  const { user, users } = store.get('user', 'users')
  // const profile = users?.find(item => item.id === id)
  const post = (store.get('posts') || []).find(post => String(post.id) === id) || {}
  const profile = users?.find(item => item.id === post.userId) || {}

  return (
    <Styled.Container>
      <Styled.Content>
        <Styled.Wrap profile>
          <Styled.Profile>
            <Styled.Image source={profile.url} />
            <Styled.Text>{profile?.desc}</Styled.Text>
          </Styled.Profile>
          <Styled.Text>{profile?.desc}</Styled.Text>
        </Styled.Wrap>
        <Styled.Wrap image>
          <Styled.Image source={post.url} />
        </Styled.Wrap>
        <Styled.Text>{post?.desc}</Styled.Text>
      </Styled.Content>
    </Styled.Container>
  )
}

const Styled = Actheme.create({
  Container: ['ScrollView', ['f:1', { contentContainerStyle: Actheme.style('fg:1 p:s5 ai,jc:c fd:row fw:wrap jc,ai:c nh:100vh bg:black25'), showsVerticalScrollIndicator: false }]],
  Image: ['Image', 'w,h:100%'],
  Content: 'w:100% xw:s160 bw:1 bc:black50 br:s5 bg:white of:hd',
  Text: ['Text', 'fs:s5 p:s5'],
  Wrap: ['View', 'w:100%', {
    image: 'h:s160 btw:1 bbw:1 bc:black50',
    profile: 'fd:row ai:c p:s5'}],
  Profile: ['View', 'w,h:s15 br:s5 of:hd'],
})

const actions = ({ store }) => ({
  MAIN_COUNT: () => store.set({ count: store.get('count') + 2 })
})


