import React, { useState } from 'react'
import { Elems, Actheme, Comps } from 'pack'
import Actstore from 'actstore'

function MainScreen() {
  const { store, handle } = Actstore({}, ['user', 'posts'])
  const router = handle.useRouter()
  const { users } = store.get('user', 'users')
  const [ mode, setMode ] = React.useState()
  const { id } = router?.query || {}
  const posts = store.get('posts') || []
  const [visible, setVisible] = useState(9)

  return <Styled.Container>
    <Styled.Content>
      <Comps.Nav mode={mode} setMode={setMode} />
      {mode === 'post' && <Comps.Upload onClose={() => setMode()} />}
      {!posts.length
        ? <Elems.Button icon="spinner-third" spin />
        : mode !== 'post' && <>
            {posts.slice(0, visible).map((post, index) => <Comps.Post key={index} id={id} post={post} profile={users?.find(item => item.id === post.userId)} />)}
            {(posts.length > visible) && <Styled.Wrap>
              <Elems.Button seeMore text="see more" onPress={() => setVisible(prevVisible => prevVisible + 6)} />
            </Styled.Wrap>}
          </>
      }
    </Styled.Content>
  </Styled.Container>
}

export default MainScreen

const Styled = Actheme.create({
  Container: ['View', 'f:1 bg:black25'],
  Content: ['ScrollView', ['f:1', { contentContainerStyle: Actheme.style('jc:c fd:row fw:wrap w:100% xw:s400 as:c ph:s5'), showsVerticalScrollIndicator: false }]],
  Wrap: ['View', 'w:100% ai:c']
})