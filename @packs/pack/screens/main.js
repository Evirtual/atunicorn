import React, { useState } from 'react'
import { Elems, Actheme, Comps } from 'pack'
import Actstore from 'actstore'

function MainScreen() {
  const { store, handle } = Actstore({}, ['user', 'posts'])
  const router = handle.useRouter()
  const {user, users } = store.get('user', 'users')
  const [ mode, setMode ] = React.useState()
  const [login, setLogin] = React.useState()
  const { id } = router?.query || {}
  const posts = store.get('posts') || []
  const [visible, setVisible] = useState(9)

  return <Styled.Container>
    {!user && login && <Comps.Login onClose={() => setLogin(!login)} />}
    <Styled.Content>
      <Comps.Nav mode={mode} setMode={setMode} login={login} setLogin={setLogin} />
      {mode === 'post'
        ? <Comps.Upload onClose={() => setMode()} />
        : !posts.length
          ? <Elems.Button icon="atom-alt" style={Actheme.style('fs:s55 c:gainsboro')} spin />
          : mode !== 'post' && <>
            {posts.slice(0, visible).map((post, index) => <Comps.Post key={index} id={id} post={post} profile={users?.find(item => item.id === post.userId)} />)}
            {(posts.length > visible) && <Styled.Wrap>
              <Elems.Button seeMore text="show more" onPress={() => setVisible(prevVisible => prevVisible + 6)} />
            </Styled.Wrap>}
          </>
      }
    </Styled.Content>
  </Styled.Container>
}

export default MainScreen

const Styled = Actheme.create({
  Container: ['View', 'f:1 bg:black25'],
  Content: ['ScrollView', ['f:1', { contentContainerStyle: Actheme.style('jc:c fd:row fw:wrap w:100% xw:s400 as:c ph:s5 pb:s5'), showsVerticalScrollIndicator: true }]],
  Wrap: ['View', 'w:100% ai:c']
})