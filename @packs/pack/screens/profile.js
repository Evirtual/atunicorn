import React, { useState, useEffect } from 'react'
import { Comps, Elems, Actheme } from 'pack'
import Actstore from 'actstore'

export default function ProfileScreen() {

  const { store, handle } = Actstore({}, ['user', 'posts'])
  const router = handle.useRouter()
  const { id } = router?.query || {}
  const { user, users } = store.get('user', 'users')
  const [ mode, setMode ] = useState('posts')
  const data = (store.get('posts') || []).filter(post => post.userId === id)
  const [posts, setPosts] = useState(data)
  const [visible, setVisible] = useState(9)

  useEffect(() => {setPosts(data)}, [user, mode])

  return (
    <Profile.Container>
      <Profile.Content>
        <Comps.Nav mode={mode} setMode={setMode} data={data} posts={posts} setPosts={setPosts} />
        {mode === 'upload' || user && user.id === id && !posts.length
          ? <Comps.Upload disabled={!user || !user.approved} onClose={() => setMode(!mode)} />
          : !posts.length
            ? <Elems.Button icon="yin-yang" loadingpost spin style={Actheme.style('fs:s35 c:lightgray')} />
            : mode !== 'post' && <>
              {posts.slice(0, visible).map((post, index) => 
                <Comps.Post key={index} id={id} post={post} user={user} profile={users?.find(item => item.id === post.userId)} onDelete={() => setMode(!mode)} />
              )}
              {(posts.length > visible) && <Profile.Wrap>
                <Elems.Button seeMore text="show more" onPress={() => setVisible(prevVisible => prevVisible + 6)} />
              </Profile.Wrap>}
            </>
        }
      </Profile.Content>
    </Profile.Container>
  )
}

const Profile = Actheme.create({
  Container: ['View', 'f:1 bg:black25'],
  Content: ['ScrollView', ['f:1', { contentContainerStyle: Actheme.style('jc:c fd:row fw:wrap w:100% xw:s400 as:c ph:s5 pb:s5'), showsVerticalScrollIndicator: true }]],
  Text: ['Text', 'fs,mb:s6 ta:c', { small: 'fs:s3'}],
  Wrap: ['View', 'w:100% ai:c']
})