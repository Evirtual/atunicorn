import React, { useState } from 'react'
import { Actheme } from '../../theme'
import Actstore from 'actstore'
import { Elems } from '../..'

const Post = Actheme.create({

  Touch: ['TouchableOpacity', 'w,h:90vw xw,xh:s100 m:s2.5 jc,ai:c bw:1 bc:black50 br:s5 of:hd bg:white'],
  Image: ['Image', 'w,h:100%'],
  Wrap: ['View', 'ps:ab t,l:s2 z:3 fd:row ai:c'],
  Profile: ['TouchableOpacity', 'w,h,br:s12 of:hd bg:black200'],
  User: ['TouchableOpacity', 'fb:500 ml:s2 bg:black200 pv:s2 ph:s3 br:s5'],
  Name: ['Text', 'c:white'],
  Remove: ['View', 'w,h,br:s8 bg:black200 ps:ab t,r:s2 ai,jc:c z:3'],
  Cover: ['TouchableOpacity', 'ps:ab z:2 t,b,l,r:0 bg:white ai,jc:c'],
  Text: ['Text', 'c:lightgray fb:500 fs:s5 mt:s4', {
    nsfw: 'fs:s6'
  }],

  Comp: (props) => {

    const {post, profile, id, user, onRemove, ...rest} = props
    const { act, handle } = Actstore({}, [])
    const router = handle.useRouter()
    const postId = post.id
    const userId = user && user.id
    const [active, setActive] = useState()
    const [nsfw, setNsfw] = useState()
    const [removing, setRemoving] = useState()

    return (
      <Post.Touch {...rest} onPress={() => router.push('../post/' + post.id)}>
        {!id &&
          <Post.Wrap>
            <Post.Profile onPress={() => setActive(!active)}>
              {!!profile?.url 
                ? <Post.Image source={profile.url} />
                : <Elems.Icon style={Actheme.style('c:white400 fs:s12')} icon="user-circle" solid />
              }
            </Post.Profile>
            {active &&
              <Post.User onPress={() => router.push('/profile/' + post.userId)}>
                <Post.Name>@{profile.username || post.userId}</Post.Name>
              </Post.User>
            }
          </Post.Wrap>
        }
        {user && user.id === id &&
          <Post.Remove>
            <Elems.Button
              remove
              icon="times"
              iconSize="s5"
              color="white"
              onPress={() => act('APP_DELETEPOST', { userId, postId, url: post.url }).then(onRemove, setRemoving(true))} />
          </Post.Remove>
        }
        {post.url &&
          <Post.Image source={post.url} />
        }
        {post.nsfw && !nsfw &&
          <Post.Cover onPress={() => setNsfw(true)}>
            <Elems.Icon style={Actheme.style('c:lightgray fs:s30')} icon="eye-slash" />
            <Post.Text nsfw>NSFW</Post.Text>
          </Post.Cover>
        }
        {removing &&
          <Post.Cover>
            <Elems.Icon style={Actheme.style('c:lightgray fs:s30')} icon="yin-yang" spin />
            <Post.Text>Removing</Post.Text>
          </Post.Cover>
        }
      </Post.Touch>
    )
  }

})

export default Post.Comp
