import React from 'react'
import { Actheme } from '../../theme'
import Actstore from 'actstore'

const Post = Actheme.create({

  Touch: ['TouchableOpacity', 'w:100% xw,h:s100 jc,ai:c bw:1 bc:black50 br:s5 of:hd m:s5 bg:white200', { md: 'xw,h:s100' }],
  Image: ['Image', 'w,h:100%'],
  Profile: ['TouchableOpacity', 'w,h,br:s10 of:hd ps:ab t,l:s2 z:2'],

  Comp: ({post, profile, id, ...props}) => {
    const { handle } = Actstore({}, [])
    const router = handle.useRouter()

    return <Post.Touch {...props} onPress={() => router.push('../post/' + post.id)}>
      {!id && <Post.Profile onPress={() => router.push('/profile/' + post.userId)}>
        <Post.Image source={profile && profile.url || 'https://c.tenor.com/xD2H2paGBt4AAAAC/prizzzle-unicorn.gif'} />
      </Post.Profile>}
      <Post.Image source={post.url} />
    </Post.Touch>
  }

})

export default Post.Comp
