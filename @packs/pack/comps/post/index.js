import React from 'react'
import { Actheme } from '../../theme'
import Actstore from 'actstore'
import { Elems } from '../..'

const Post = Actheme.create({

  Touch: ['TouchableOpacity', 'w:100% xw,h:s100 jc,ai:c bw:1 bc:black50 br:s5 of:hd m:s5 bg:white'],
  Image: ['Image', 'w,h:100%'],
  Wrap: ['View', 'ps:ab t,l:s2 z:3 fd:row ai:c'],
  Profile: ['TouchableOpacity', 'w,h,br:s12 of:hd bg:black200'],
  User: ['TouchableOpacity', 'fb:500 ml:s2 bg:black200 pv:s2 ph:s3 br:s5'],
  Name: ['Text', 'c:white'],
  Delete: ['View', 'w,h,br:s8 of:hd ps:ab t,r:s2 z:3 bg:black200 ai,jc:c'],
  Nsfw: ['TouchableOpacity', 'ps:ab z:2 t,b,l,r:0 bg:white ai,jc:c'],
  Text: ['Text', 'c:black100 fb:500 fs:s6'],

  Comp: ({post, profile, id, user, ...props}) => {
    const { act, handle } = Actstore({}, [])
    const router = handle.useRouter()
    const postId = post.id
    const userId = user && user.id
    const [active, setActive] = React.useState()
    const [nsfw, setNsfw] = React.useState()

    return <Post.Touch {...props} onPress={() => router.push('../post/' + post.id)}>
      <Post.Wrap>
        {!id && <Post.Profile onPress={() => setActive(!active)}>
          {profile && profile.url 
            ? <Post.Image source={profile.url} />
            : <Elems.Icon style={Actheme.style('c:white400 fs:s12')} icon="user-circle" solid />
          }
        </Post.Profile>}
        {active && <Post.User onPress={() => router.push('/profile/' + post.userId)}>
          <Post.Name>@{profile && profile.username || post.userId}</Post.Name>
        </Post.User>}
      </Post.Wrap>
      {user && user.id === id && <Post.Delete>
        <Elems.Button icon="times-circle" iconSize="s8" color="white" onPress={() => act('APP_DELETEPOST', { userId, postId, url: post.url }).then(props.onClose)} />
      </Post.Delete>}
      <Post.Image source={post.url} />
      {!!post.nsfw && !nsfw && <Post.Nsfw onPress={() => setNsfw(true)}>
        <Elems.Icon style={Actheme.style('c:black100 fs:s15')} icon="eye-slash" solid />
        <Post.Text>NSFW</Post.Text>
      </Post.Nsfw>
      }
    </Post.Touch>
  }

})

export default Post.Comp
