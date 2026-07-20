import React, { useState } from 'react'
import { Comps, Elems, Actheme } from 'pack'
import Actstore from 'pack/store/actstore'
import Markdown from 'markdown-to-jsx';
import { buildAboutRoute, getAboutCloseRoute, normalizePath } from './route-state'

const DEFAULT_ABOUT_DESC = [
  '**A place to express your uniqueness**',
  '',
  'in ways that inspire us to feel more confident in our everyday life.',
  '',
  '---',
  '',
  '### Inspired by',
  '',
  '[Unicorn Art](https://dribbble.com/shots/4409254-Scenarium-icons-vol-9)',
  '',
  '### Developed using',
  '',
  '[Next.js](https://nextjs.org/) [React](https://reactjs.org/) [React Native](https://reactnative.dev/) [Firebase](https://firebase.google.com/)'
].join('\n')

const createAboutMarkdownOptions = ({ centered = false, compactLinks = false } = {}) => ({
  forceBlock: true,
  overrides: {
    h1: {
      props: {
        style: {
          margin: '0 0 16px',
          color: 'rgb(34, 34, 34)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          fontSize: '24px',
          fontWeight: 600,
          lineHeight: 1.3,
          textAlign: centered ? 'center' : 'left'
        }
      }
    },
    h2: {
      props: {
        style: {
          margin: '0 0 16px',
          color: 'rgb(34, 34, 34)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          fontSize: '22px',
          fontWeight: 600,
          lineHeight: 1.35,
          textAlign: centered ? 'center' : 'left'
        }
      }
    },
    h3: {
      props: {
        style: {
          margin: centered ? '0 0 12px' : '0 0 16px',
          color: 'rgb(34, 34, 34)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          fontSize: centered ? '17px' : '20px',
          fontWeight: 600,
          lineHeight: 1.4,
          letterSpacing: centered ? '0.01em' : '0',
          textAlign: centered ? 'center' : 'left'
        }
      }
    },
    p: {
      props: {
        style: {
          margin: centered ? '0 auto 14px' : '0 0 16px',
          color: 'rgba(34, 34, 34, 0.9)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          fontSize: '16px',
          fontWeight: 400,
          lineHeight: 1.7,
          maxWidth: centered ? '430px' : 'none',
          textAlign: centered ? 'center' : 'left'
        }
      }
    },
    hr: {
      props: {
        style: {
          border: 0,
          borderTop: '1px solid rgba(34, 34, 34, 0.25)',
          margin: centered ? '22px auto 18px' : '22px 0 18px',
          maxWidth: centered ? '430px' : 'none',
          width: '100%'
        }
      }
    },
    ul: {
      props: {
        style: {
          margin: '0 0 16px',
          paddingLeft: centered ? '0' : '20px',
          listStylePosition: centered ? 'inside' : 'outside',
          textAlign: centered ? 'center' : 'left'
        }
      }
    },
    li: {
      props: {
        style: {
          marginBottom: '8px',
          color: 'rgba(34, 34, 34, 0.9)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          fontSize: '16px',
          lineHeight: 1.7,
          textAlign: centered ? 'center' : 'left'
        }
      }
    },
    strong: {
      props: {
        style: {
          fontWeight: 600,
          color: 'rgb(34, 34, 34)',
          fontSize: centered ? '17px' : 'inherit'
        }
      }
    },
    a: {
      props: {
        style: {
          color: 'rgb(52, 113, 235)',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          fontSize: '16px',
          fontWeight: 500,
          lineHeight: 1.7,
          textDecoration: 'none',
          display: compactLinks ? 'inline-block' : 'inline',
          margin: compactLinks ? '0 8px 6px' : '0'
        }
      }
    }
  }
})

const MAIN_ABOUT_MARKDOWN_OPTIONS = createAboutMarkdownOptions({ centered: true, compactLinks: true })
const PROFILE_ABOUT_MARKDOWN_OPTIONS = createAboutMarkdownOptions()

export default function AboutScreen(props) {

  const {
    user: propUser,
    users: propUsers,
    mode,
    router: propRouter,
    path: propPath,
    id: propId,
    profileId: propProfileId,
  } = props

  const { store, handle } = Actstore({}, ['user', 'users'])
  const router = propRouter || handle.useRouter()
  const { id: routeId } = router?.query || {}
  const path = normalizePath(propPath || router?.asPath)
  const user = typeof propUser !== 'undefined' ? propUser : store.get('user')
  const users = typeof propUsers !== 'undefined' ? propUsers : store.get('users')

  const url = path?.replace(/\/$/, '')
  const segments = url?.split('/').filter(Boolean) || []
  const pathProfileId = segments[0] === 'profile' ? segments[1] : null
  const resolvedProfileId = propProfileId || propId || routeId || pathProfileId

  const profile = users?.find(item => item.id === resolvedProfileId) || {}

  const aboutProfilePath = resolvedProfileId ? buildAboutRoute(resolvedProfileId) : null
  const isProfileAboutPage = path === aboutProfilePath
  const closeHref = getAboutCloseRoute(isProfileAboutPage ? resolvedProfileId : null)
  const markdownOptions = isProfileAboutPage ? PROFILE_ABOUT_MARKDOWN_OPTIONS : MAIN_ABOUT_MARKDOWN_OPTIONS
  const placeholderTitle =
    (profile?.id || (path === aboutProfilePath && resolvedProfileId))
      ? `Welcome @${profile?.username || resolvedProfileId}`
      : 'Welcome @unicorn'
  const placeholderDesc =
    (profile?.id || (path === aboutProfilePath && resolvedProfileId))
      ? `This is\n@${profile?.username || resolvedProfileId}\nabout section`
      : DEFAULT_ABOUT_DESC

  const [edit, setEdit] = useState()
  const [changeNav, setChangeNav] = useState()

  const handleNav = (e) => {
    const scrolled = e.nativeEvent.contentOffset.y
    scrolled > 264
      ? setChangeNav(true)
      : setChangeNav(false)
  }

  return (
    <About.Container mode={mode}>
      <Comps.Meta
        title={path === aboutProfilePath ? (profile?.username || resolvedProfileId) : "unicorn"}
        desc="about"
        url={path === aboutProfilePath && `https://atunicorn.io/profile/${resolvedProfileId || profile?.id}`}
        cover={path === aboutProfilePath && profile.url} />
      <About.ScrollView
        onScroll={!mode && handleNav}
        scrollEventThrottle={1}
        stickyHeaderIndices={!mode && [0]}
        contentContainerStyle={Actheme.style(`jc,ai:c ${!mode ? 'pt:s66' : 'fg:1 pt:s2.5'}`)}
      >
        {!mode && <Comps.Nav changeNav={changeNav} backHref={closeHref} />}

        <About.Wrap mode={mode}>
          <About.Options>
            {user && user?.id === ( resolvedProfileId || profile?.id ) && 
              <Elems.Button
                option
                regular
                icon="pencil"
                onPress={() => setEdit(true)} />
            }
            {mode &&
              <Elems.Button
                option
                close
                icon="times"
                onPress={() => router.replace(closeHref)}
                style={Actheme.style('ml:s1')} />
            }
            </About.Options>
          {profile?.about
            ? <About.Markdown main={!isProfileAboutPage}>
                <Markdown options={markdownOptions}>
                  {profile?.about}
                </Markdown>
              </About.Markdown>
            : <About.Empty>
                <About.Title>{placeholderTitle}</About.Title>
                <About.Markdown main={!isProfileAboutPage}>
                  <Markdown options={markdownOptions}>
                    {placeholderDesc}
                  </Markdown>
                </About.Markdown>
              </About.Empty>
          }
        </About.Wrap>
      </About.ScrollView>

      {edit && 
        <Comps.About 
          profile={profile} 
          onClose={() => setEdit(false)} />
      }
      
    </About.Container>
  )
}

const About = Actheme.create({
  Container: ['View', 'f:1 bg:grey', {
    mode: 'ps:fixed t,b,l,r:0 z:10 bg:black400'
  }],
  ScrollView: ['ScrollView', ['f:1']],
  Wrap: ['View', 'bg:white br:s5 w:90vw nh,xw:s95 ai,jc:c bw:1 bc:border mt:s2.5 mh:s5 mb:s22.5', {
    mode: 'mb:s5'
  }],
  Empty: ['View', 'w:100% ai,jc:c p:s5'],
  Title: ['Text', 'fs:s4 fb:500 ta:c c:black400'],
  Markdown: ['View', 'w:100% pv:s2 ph:s5', {
    main: 'xw:s80'
  }],
  Options: ['View', 'fd:row ps:ab t,r:s1.5 ai,jc:c z:3'],
})
