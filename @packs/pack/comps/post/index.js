import React from 'react'
import { Actheme } from '../../theme'
import Actstore from 'actstore'
import { Elems } from '../..'

const Post = Actheme.create({

  Touch: ['TouchableOpacity', 'w:100% xw,h:s100 jc,ai:c bw:1 bc:black50 br:s5 of:hd m:s5 bg:white200', { md: 'xw,h:s100' }],
  Image: ['Image', 'w,h:100%'],
  Wrap: ['View', 'ps:ab t,l:s2 z:2 fd:row ai:c'],
  Profile: ['TouchableOpacity', 'w,h,br:s12 of:hd'],
  User: ['TouchableOpacity', 'fb:500 ml:s2 bg:black200 pv:s2 ph:s3 br:s5'],
  Name: ['Text', 'c:white'],
  Delete: ['View', 'w,h,br:s8 of:hd ps:ab t,r:s2 z:2 bg:black200 ai,jc:c'],

  Comp: ({post, profile, id, user, ...props}) => {
    const { act, handle } = Actstore({}, [])
    const router = handle.useRouter()
    const postId = post.id
    const userId = user && user.id
    const [active, setActive] = React.useState()

    return <Post.Touch {...props} onPress={() => router.push('../post/' + post.id)}>
      <Post.Wrap>
        {!id && <Post.Profile onPress={() => setActive(!active)}>
          <Post.Image source={profile && profile.url || 'https://c.tenor.com/xD2H2paGBt4AAAAC/prizzzle-unicorn.gif'} />
        </Post.Profile>}
        { active && <Post.User onPress={() => router.push('/profile/' + post.userId)}>
          <Post.Name>@{profile && profile?.desc || post.userId}</Post.Name>
        </Post.User> }
      </Post.Wrap>
      {user && user.id === id && <Post.Delete>
        <Elems.Button icon="times-circle" iconSize="s8" color="white" onPress={() => act('APP_DELETEPOST', { userId, postId }).then(props.onClose)} />
      </Post.Delete>}
      <Post.Image source={post.url} />
    </Post.Touch>
  }

})

export default Post.Comp
