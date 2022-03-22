import React, { useState } from 'react'
import { Actheme } from '../../theme'
import Elems from '../../elems'
import Actstore from 'actstore'

const Post = Actheme.create({

  Container: ['View', 'm:s2.5 jc,ai:c bw:1 bc:black50 br:s5 of:hd bg:white'],
  Content: ['View', 'w,h:90vw xw,xh:s90 jc,ai:c'],
  Image: ['Image', 'w,h:100%'],
  Wrap: ['View', 'ps:ab t,l:s2 z:3 fd:row ai:c'],
  Profile: ['TouchableOpacity', 'w,h,br:s12 of:hd bg:black200 bw:1.75 bc:white'],
  User: ['View', 'ml:s2 bg:white400 bw:1.75 bc:black pv:s2 ph:s3 br:s6'],
  Name: ['Text', 'c:black fb:500'],
  Option: ['View', 'ps:ab t,r:s2 ai,jc:c z:3', {
    edit: 'r:s12'
  }],
  Cover: ['TouchableOpacity', 'ps:ab z:2 t,b,l,r:0 bg:white ai,jc:c'],
  Text: ['Text', 'c:lightgray fb:500 fs:s5 mt:s4', {
    nsfw: 'fs:s6'
  }],

  Comp: (props) => {

    const {post, profile, id, user, onRemove, onEdit} = props
    const { act } = Actstore({}, [])
    const [active, setActive] = useState()
    const [nsfw, setNsfw] = useState()
    const [recycling, setRecycling] = useState()

    return (
      <Post.Container>
        {user && user?.id === id &&
          <>
            <Post.Option>
              <Elems.Button
                option
                recycle
                regular
                icon="recycle"
                onPress={() => act('APP_DELETEPOST', { userId: user?.id , postId: post?.id , url: post?.url }).then(onRemove, setRecycling(true))} />
            </Post.Option>
            <Post.Option edit>
              <Elems.Button
                option
                edit
                regular
                icon="pencil"
                onPress={onEdit} />
            </Post.Option>
          </>
        }
        {post.nsfw && !nsfw &&
          <Post.Cover onPress={() => setNsfw(true)}>
            <Elems.Icon style={Actheme.style('c:lightgray fs:s30')} icon="eye-slash" />
            <Post.Text nsfw>NSFW</Post.Text>
          </Post.Cover>
        }
        {!id &&
          <Post.Wrap>
            <Post.Profile onPress={() => setActive(!active)}>
              {!!profile?.url 
                ? <Post.Image source={profile.url} />
                : <Elems.Icon style={Actheme.style('c:white400 fs:s12')} icon="user-circle" solid />
              }
            </Post.Profile>
            {active &&
              <Elems.Link href={`/profile/${post?.userId}`}>
                <Post.User>
                  <Post.Name>@{profile.username || profile.id}</Post.Name>
                </Post.User>
              </Elems.Link>
            }
          </Post.Wrap>
        }
        <Elems.Link href={`../post/${post.id}`}>
          <Post.Content>
            {post.url &&
              <Post.Image source={post.url} />
            }
            {recycling &&
              <Post.Cover>
                <Elems.Icon icon="yin-yang" spin iconColor="lightgray" iconSize="s30" />
                <Post.Text>Recycling</Post.Text>
              </Post.Cover>
            }
          </Post.Content>
        </Elems.Link>
      </Post.Container>
    )
  }

})

export default Post.Comp
