import React from 'react'
import { Comps, Elems, Actheme } from 'pack'
import Actstore from 'actstore'

export default function ProfileScreen(props) {
  const { store, handle } = Actstore({}, ['user', 'posts'])
  const router = handle.useRouter()
  const { id } = router?.query || {}
  const { users } = store.get('user', 'users')
  const posts = (store.get('posts') || []).filter(post => post.userId === id)

  return (<Styled.Container>
    <Styled.Content>
      <Comps.Nav />
      {!posts
        ? <Elems.Button icon="spinner-third" spin />
        : posts.map((post, index) => <Post.Comp key={index} id={id} post={post} profile={users?.find(item => item.id === post.userId)} />)}
    </Styled.Content>
  </Styled.Container>
  )
}

const Styled = Actheme.create({
  Container: ['View', 'f:1 bg:black25'],
  Content: ['ScrollView', ['f:1', { contentContainerStyle: Actheme.style('jc:c fd:row fw:wrap w:100% xw:s400 as:c ph:s5'), showsVerticalScrollIndicator: false }]],
  Text: ['Text', 'fs,mb:s6 ta:c', { small: 'fs:s3'}],
})

const Post = Actheme.create({

  Touch: ['TouchableOpacity', 'w:100% xw,h:s100 jc,ai:c bw:1 bc:black50 br:s5 of:hd m:s5 bg:white200', { md: 'xw,h:s100' }],
  Image: ['Image', 'w,h:100%'],
  Profile: ['TouchableOpacity', 'w,h,br:s10 of:hd ps:ab t,l:s2 z:2'],

  Comp: ({post, profile, id, ...props}) => {
    const { handle } = Actstore({}, [])
    const router = handle.useRouter()

    return <Post.Touch {...props} onPress={() => router.push('post/' + post.id)}>
      {!id && <Post.Profile onPress={() => router.push('/profile/' + post.userId)}>
        <Post.Image source={profile && profile.url || 'https://c.tenor.com/xD2H2paGBt4AAAAC/prizzzle-unicorn.gif'} />
      </Post.Profile>}
      <Post.Image source={post.url} />
    </Post.Touch>
  }

})
