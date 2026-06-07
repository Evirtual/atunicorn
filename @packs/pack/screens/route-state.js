export const normalizePath = (path) => {
  const pathname = String(path || '').split('?')[0].split('#')[0]

  if (!pathname || pathname === '/') {
    return '/'
  }

  return pathname.endsWith('/')
    ? pathname
    : `${pathname}/`
}

const getQueryString = (path) => String(path || '').split('?')[1]?.split('#')[0] || ''
const MODAL_INTENT_STORAGE_KEY = 'atunicorn.modal-intent'
const recentlyConsumedModalIntents = new Map()

const getModalIntentStorageKey = (path) => [
  MODAL_INTENT_STORAGE_KEY,
  normalizePath(path),
  getQueryString(path)
].filter(Boolean).join(':')

const getRouteParams = (path) => new URLSearchParams(getQueryString(path))

const getPathSegments = (path) => normalizePath(path).split('/').filter(Boolean)

const inferProfileId = (path) => {
  const segments = getPathSegments(path)

  return segments[0] === 'profile'
    ? segments[1]
    : null
}

const resolveBasePath = (path, profileId) => {
  if (profileId) {
    return buildProfileRoute(profileId)
  }

  return normalizePath(path) === '/'
    ? '/'
    : '/'
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

export const buildHomeRoute = ({ search = '', postId } = {}) =>
  buildRoute('/', { search, post: postId })

export const buildProfileRoute = (profileId, { postId } = {}) =>
  profileId
    ? buildRoute(`/profile/${profileId}/`, { post: postId })
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

export const createModalIntent = ({ kind, ownerPath }) => ({
  kind,
  ownerPath: normalizePath(ownerPath)
})

export const saveModalIntent = (path, modalIntent) => {
  if (typeof window === 'undefined' || !window.sessionStorage || !modalIntent || !path) {
    return
  }

  window.sessionStorage.setItem(
    getModalIntentStorageKey(path),
    JSON.stringify(createModalIntent(modalIntent))
  )
}

export const consumeModalIntent = (path) => {
  if (typeof window === 'undefined' || !window.sessionStorage || !path) {
    return null
  }

  const storageKey = getModalIntentStorageKey(path)
  const cachedIntent = recentlyConsumedModalIntents.get(storageKey)

  if (cachedIntent) {
    recentlyConsumedModalIntents.delete(storageKey)

    return cachedIntent
  }

  const rawIntent = window.sessionStorage.getItem(storageKey)

  if (!rawIntent) {
    return null
  }

  window.sessionStorage.removeItem(storageKey)

  try {
    const parsedIntent = JSON.parse(rawIntent)

    if (!parsedIntent?.kind || !parsedIntent?.ownerPath) {
      return null
    }

    const normalizedIntent = createModalIntent(parsedIntent)

    recentlyConsumedModalIntents.set(storageKey, normalizedIntent)

    return normalizedIntent
  } catch {
    return null
  }
}

const matchesModalIntent = ({ modalIntent, kind, ownerPath }) =>
  !!modalIntent &&
  modalIntent.kind === kind &&
  modalIntent.ownerPath === normalizePath(ownerPath)

export const resolveRoutePresentation = ({
  path,
  profileId,
  postId,
  modalIntent,
}) => {
  const normalizedPath = normalizePath(path)
  const routeParams = getRouteParams(path)
  const resolvedProfileId = profileId || inferProfileId(path)
  const resolvedPostId = postId || routeParams.get('post') || null
  const resolvedSearch = routeParams.get('search') || ''
  const profilePath = resolvedProfileId ? buildProfileRoute(resolvedProfileId) : null
  const profileAboutPath = resolvedProfileId ? buildAboutRoute(resolvedProfileId) : null
  const directPostPath = resolvedPostId ? buildPostRoute(resolvedPostId) : null
  const closeHref = resolvedProfileId ? buildProfileRoute(resolvedProfileId) : '/'

  if (directPostPath && normalizedPath === directPostPath) {
    return { page: 'post', overlay: null, closeHref }
  }

  if (normalizedPath === '/about/') {
    return { page: 'about', overlay: null, closeHref: '/' }
  }

  if (profileAboutPath && normalizedPath === profileAboutPath) {
    if (matchesModalIntent({ modalIntent, kind: 'about', ownerPath: closeHref })) {
      return {
        page: 'profile',
        overlay: { kind: 'about', ownerPath: closeHref },
        closeHref
      }
    }

    return { page: 'about', overlay: null, closeHref }
  }

  if (resolvedPostId && normalizedPath === '/') {
    if (matchesModalIntent({ modalIntent, kind: 'post', ownerPath: '/' })) {
      return {
        page: 'home',
        overlay: { kind: 'post', ownerPath: '/' },
        closeHref: buildHomeRoute({ search: resolvedSearch })
      }
    }

    return {
      page: 'post',
      overlay: null,
      closeHref: buildHomeRoute({ search: resolvedSearch })
    }
  }

  if (resolvedPostId && profilePath && normalizedPath === profilePath) {
    if (matchesModalIntent({ modalIntent, kind: 'post', ownerPath: profilePath })) {
      return {
        page: 'profile',
        overlay: { kind: 'post', ownerPath: profilePath },
        closeHref: profilePath
      }
    }

    return { page: 'post', overlay: null, closeHref: profilePath }
  }

  if (profilePath && normalizedPath === profilePath) {
    return { page: 'profile', overlay: null, closeHref: profilePath }
  }

  return {
    page: resolveBasePath(path, resolvedProfileId) === '/'
      ? 'home'
      : 'profile',
    overlay: null,
    closeHref
  }
}