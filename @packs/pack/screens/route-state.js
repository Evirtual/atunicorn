export const normalizePath = (path) => {
  const pathname = String(path || '').split('?')[0].split('#')[0]

  if (!pathname || pathname === '/') {
    return '/'
  }

  return pathname.endsWith('/')
    ? pathname
    : `${pathname}/`
}

const buildRoute = (pathname, query = {}) => {
  const normalizedPath = normalizePath(pathname)
  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== false && value !== '') {
      params.set(key, String(value))
    }
  })

  const nextQuery = params.toString()

  return nextQuery
    ? `${normalizedPath}?${nextQuery}`
    : normalizedPath
}

export const buildHomeRoute = ({ search = '' } = {}) =>
  buildRoute('/', { search })

export const buildProfileRoute = (profileId) =>
  profileId
    ? normalizePath(`/profile/${profileId}/`)
    : '/'

export const buildAboutRoute = (profileId) =>
  profileId
    ? normalizePath(`/profile/${profileId}/about/`)
    : '/about/'

export const buildPostRoute = (postId) =>
  postId
    ? normalizePath(`/post/${postId}/`)
    : '/'

export const getAboutCloseRoute = (profileId) =>
  profileId
    ? buildProfileRoute(profileId)
    : '/'
