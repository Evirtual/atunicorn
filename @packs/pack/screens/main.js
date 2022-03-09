import React, { useState, useEffect } from 'react'
import { Elems, Actheme, Comps } from 'pack'
import Actstore from 'actstore'

function MainScreen() {
  const { store, handle } = Actstore({}, ['user', 'posts'])
  const router = handle.useRouter()
  const {user, users } = store.get('user', 'users')
  const [ mode, setMode ] = useState('posts')
  const [login, setLogin] = useState()
  const { id } = router?.query || {}
  const data = store.get('posts') || []
  const [posts, setPosts] = useState(data)
  const [visible, setVisible] = useState(9)

  useEffect(() => {setPosts(data)}, [user, mode])

  return (
    <Main.Container>
      {(!user?.emailVerified) && login && <Comps.Login onClose={() => setLogin(!login)} />}
      <Main.Content>
        <Comps.Nav mode={mode} setMode={setMode} login={login} setLogin={setLogin} data={data} posts={posts} setPosts={setPosts} />
        {mode === 'upload'
          ? <Comps.Upload onClose={() => setMode('posts')} />
          : !posts.length
            ? <Elems.Button icon="yin-yang" loadingpost spin style={Actheme.style('fs:s35 c:lightgray')} />
            : mode !== 'post' && <>
              {posts.slice(0, visible).map((post, index) => 
                <Comps.Post key={index} id={id} post={post} profile={users?.find(item => item.id === post.userId)} />
              )}
              {(posts.length > visible) && <Main.Wrap>
                <Elems.Button seeMore text="Show more" onPress={() => setVisible(prevVisible => prevVisible + 6)} />
              </Main.Wrap>}
            </>
        }
      </Main.Content>
    </Main.Container>
  )
}

export default MainScreen

const Main = Actheme.create({
  Container: ['View', 'f:1 bg:black25'],
  Content: ['ScrollView', ['f:1', { contentContainerStyle: Actheme.style('jc:c fd:row fw:wrap w:100% xw:s400 as:c ph:s5 pb:s15'), showsVerticalScrollIndicator: true }]],
  Wrap: ['View', 'w:100% ai:c']
})