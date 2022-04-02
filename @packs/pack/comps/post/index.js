import React, { useState } from 'react'
import { Actheme } from '../../theme'
import Elems from '../../elems'
import Placeholder from '../placeholder'
import Actstore from 'actstore'

const Post = Actheme.create({

  Container: ['View', 'm:s2.5'],
  Content: ['View', 'w,h:90vw xw,xh:s95 br:s5 of:hd bg:white bw:1 bc:black50'],
  Wrap: ['View', 'ps:ab t,l:s2 z:3 fd:row ai:c'],
  Image: ['Image', 'w,h:100% br:s5'],
  Profile: ['TouchableOpacity', 'w,h,br:s12 of:hd bg:black200 bw:2 bc:white ai,jc:c z:2'],
  User: ['View', 'ml:-s7 bg:white400 pv:s2.5 ph:s3.5 pl:s8.5 br:s6'],
  Name: ['Text', 'c:black fb:500'],
  Options: ['View', 'fd:row ps:ab t,r:s2 ai,jc:c z:3'],
  Cover: ['TouchableOpacity', 'ps:ab z:2 t,b,l,r:0'],

  Comp: (props) => {

    const {post, profile, id, user, onRemove, onEdit} = props
    const { act } = Actstore({}, [])
    
    const [active, setActive] = useState()
    const [nsfw, setNsfw] = useState()
    const [recycling, setRecycling] = useState()

    return (
      <Post.Container>
        {!id &&
          <Post.Wrap>
            <Post.Profile onPress={() => setActive(!active)}>
              {!!profile?.url 
                ? <Post.Image source={profile.url} />
                : <Elems.Icon
                    icon="user-circle" 
                    iconSize="s12" 
                    iconColor="black100" 
                    solid />
              }
            </Post.Profile>
            {active &&
              <Elems.Link href={`/profile/${post?.userId}`}>
                <Post.User>
                  <Post.Name>@{profile?.username || profile.id}</Post.Name>
                </Post.User>
              </Elems.Link>
            }
          </Post.Wrap>
        }
        <Elems.Link href={`/post/${post.id}`}>
          <Post.Content>
            {post?.url &&
              <Post.Image source={post.url || null} />
            }
            {recycling &&
              <Post.Cover onPress={() => setNsfw(true)}>
                <Placeholder
                  icon="yin-yang"
                  spin
                  title="Recycling" />
              </Post.Cover>
            }
          </Post.Content>
        </Elems.Link>
        {user && user?.id === id &&
          <Post.Options>
            <Elems.Button
              option
              edit
              regular
              icon="pencil"
              onPress={onEdit}
              style={Actheme.style('mr:s1')} />
            <Elems.Button
              option
              recycle
              regular
              icon="recycle"
              onPress={
                () => 
                  act('APP_DELETEPOST', { userId: user?.id , postId: post?.id , url: post?.url })
                    .then(onRemove, setRecycling(true))
              }
            />
          </Post.Options>
        }
        {post.nsfw && !nsfw &&
          <Post.Cover onPress={() => setNsfw(true)}>
            <Placeholder
              icon="eye-slash"
              title="NSFW" />
          </Post.Cover>
        }
      </Post.Container>
    )
  }

})

export default React.memo(Post.Comp)
