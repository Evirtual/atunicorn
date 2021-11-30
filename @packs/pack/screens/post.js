import React from 'react'
import { Comps, Elems, Actheme } from 'pack'
import Actstore from 'actstore'

export default function PostScreen(props) {
  const { store, action, act, handle } = Actstore({}, ['user', 'posts'])
  const router = handle.useRouter()
  const { id } = router?.query || {}
  const { user, users } = store.get('user', 'users')
  // const profile = users?.find(item => item.id === id)
  const post = (store.get('posts') || []).find(post => String(post.id) === id) || {}
  const profile = users?.find(item => item.id === post.userId) || {}

  return (<Styled.Container>
    <Styled.Wrap>
      <Elems.Button text="Back" icon="arrow-left" iconSize="s4" fontSize="s4" inline onPress={() => router?.push('/')} />
    </Styled.Wrap>
    <Styled.Content>
      <Styled.Wrap profile>
        <Styled.Profile>
          <Styled.Image source={profile.url} />
        </Styled.Profile>
        <Elems.Button text={profile?.desc} onPress={() => router.push('../profile/' + post.userId)} />
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
  Container: ['ScrollView', ['f:1', { contentContainerStyle: Actheme.style('fg:1 p:s5 ai,jc:c bg:black25'), showsVerticalScrollIndicator: false }]],
  Image: ['Image', 'w,h:100%'],
  Content: 'w:100% xw:s150 bw:1 bc:black50 br:s5 bg:white of:hd mt:s5',
  Text: ['Text', 'fs:s5 p:s5'],
  Wrap: ['View', 'w:100% xw:s150', {
    image: 'h:s150 btw:1 bbw:1 bc:black50',
    profile: 'fd:row ai:c p:s5',}],
  Profile: ['View', 'w,h,br:s15 of:hd mr:s2'],
})

const actions = ({ store }) => ({
  MAIN_COUNT: () => store.set({ count: store.get('count') + 2 })
})


