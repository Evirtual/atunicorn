import configs from 'pack/store/configs'

const getDatabaseUrl = () => {
  const base = configs?.firebase?.databaseUrl
  if (!base) return null
  return base.endsWith('/') ? base : `${base}/`
}

export const fetchProfileInitialState = async (id) => {
  const initialState = { posts: [], users: [], ready: true }
  if (!id) {
    return { initialState, profileId: id }
  }

  const databaseUrl = getDatabaseUrl()
  if (!databaseUrl) {
    return { initialState, profileId: id }
  }

  try {
    const userResponse = await fetch(`${databaseUrl}users/${id}.json`)
    if (userResponse.ok) {
      const user = await userResponse.json()
      if (user) {
        initialState.users = [user]
      }
    }

    const postsResponse = await fetch(`${databaseUrl}posts/${id}.json`)
    if (postsResponse.ok) {
      const userPosts = await postsResponse.json()
      if (userPosts && typeof userPosts === 'object') {
        initialState.posts = Object.values(userPosts)
          .filter(Boolean)
          .sort((a, b) => (b?.id || 0) - (a?.id || 0))
      }
    }
  } catch (error) {
    console.warn('Failed to prefetch profile data', error)
  }

  return { initialState, profileId: id }
}

export default fetchProfileInitialState
