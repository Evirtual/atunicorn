import React, { useState } from 'react'
import { Actheme } from '../../theme'
import Elems from '../../elems'
import Placeholder from '../placeholder'
import Actstore from 'actstore'

const Post = Actheme.create({

  Container: ['View', 'm:s2.5'],
  Content: ['View', 'w,h:90vw xw,xh:s95 br:s5 of:hd bg:white bw:1 bc:grey'],
  Wrap: ['View', 'ps:ab t,l:s2 z:3 fd:row ai:c'],
  Image: ['Image', 'w,h:100% br:s5'],
  Profile: ['TouchableOpacity', 'w,h,br:s12 of:hd bg:black200 bw:2 bc:white400 ai,jc:c z:2'],
  User: ['View', 'ml:-s7 bg:white400 pv:s2 ph:s4 pl:s8 br:s6 bw:2 bc:grey'],
  Name: ['Text', 'c:black fb:500'],
  Options: ['View', 'fd:row ps:ab t,r:s2 ai,jc:c z:3'],
  Cover: ['TouchableOpacity', 'ps:ab z:2 t,b,l,r:0'],

  Comp: (props) => {

    const {post, profile, id, user, onRemove, onEdit, onProfile, onPost, profileId} = props
    const { act, handle } = Actstore({}, [])

    const router = handle.useRouter()

    const path = router.asPath
    const profilePath = `/profile/${profileId || id}/`
    
    const [active, setActive] = useState()
    const [nsfw, setNsfw] = useState()
    const [recycling, setRecycling] = useState()

    return (
      <Post.Container>
        {!id && !profileId &&
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
              <Elems.Link
                href="/"
                as={ `/profile/${profile?.id || id}`}
                onClick={onProfile}
              >
                <Post.User>
                  <Post.Name>@{profile?.username || profile.id}</Post.Name>
                </Post.User>
              </Elems.Link>
            }
          </Post.Wrap>
        }
        <Elems.Link 
          href={
            path === profilePath && !profileId
              ? `/profile/[id]?id=${profile?.id || id}`
              : '/'
          }
          as={ `/post/${post?.id || id}`}
          onClick={onPost}
        >
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
        {user && user?.id === (profileId || id) &&
          <Post.Options>
            <Elems.Button
              option
              edit
              regular
              icon="pencil"
              onPress={onEdit} />
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
              style={Actheme.style('ml:s1.5')}
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

export default Post.Comp
