import React from 'react'
import { Comps, Elems, Actheme } from 'pack'
import Actstore from 'actstore'

export default function PostScreen(props) {
  const { store, handle } = Actstore({}, ['user', 'posts'])
  const router = handle.useRouter()
  const { id } = router?.query || {}
  const { user, users } = store.get('user', 'users')
  const post = (store.get('posts') || []).find(post => String(post.id) === id) || {}
  const profile = users?.find(item => item.id === post.userId) || {}

  return (<Styled.Container>
    <Styled.Wrap>
      <Elems.Button text="Back" icon="arrow-left" inline onPress={() => router.push(id ? '/' : '/' + user.id)} />
    </Styled.Wrap>
    <Styled.Content>
      <Styled.Profile onPress={() => router.push('/profile/' + post.userId)}>
        <Styled.Wrap profile>
          <Styled.Image source={profile.url} />
        </Styled.Wrap>
        <Styled.Name>{profile?.desc}</Styled.Name>
      </Styled.Profile>
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
  Text: ['Text', 'fs:s4 p:s5'],
  Wrap: ['View', 'w:100% xw:s150', {
    image: 'h:s150 btw:1 bbw:1 bc:black50',
    profile: 'fd:row ai:c w,h,br:s15 of:hd',}],
  Profile: ['TouchableOpacity', 'fd:row ai:c m:s5'],
  Name: ['Text', 'fs:s4 fb:500 ml:s2'],
})

const actions = ({ store }) => ({
  MAIN_COUNT: () => store.set({ count: store.get('count') + 2 })
})


