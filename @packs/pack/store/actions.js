import firebase from 'firebase/compat/app'
import 'firebase/compat/messaging'
import 'firebase/compat/auth'
import 'firebase/compat/database'
import Router from 'next/router'
import Compress from "react-image-file-resizer"

const getStorageEndpoint = (configs) => (configs.storage?.apiUrl || '').replace(/\/$/, '')

const isCloudinaryStorage = (configs) => configs.storage?.provider === 'cloudinary'

const uploadToCloudinary = async ({ configs, file, kind, user }) => {
  const endpoint = getStorageEndpoint(configs)
  if (!endpoint) throw new Error('Cloudinary storage API URL is not configured')

  const currentUser = firebase.auth().currentUser
  const token = currentUser && await currentUser.getIdToken()
  if (!token) throw new Error('Please login before uploading')

  const form = new FormData()
  form.append('file', file)
  form.append('kind', kind || 'upload')

  const response = await fetch(`${endpoint}/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: form
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error || 'Unable to upload image')
  if (!body.url) throw new Error('Storage upload did not return a URL')

  return body.url
}

const deleteFromCloudinary = async ({ configs, url }) => {
  const endpoint = getStorageEndpoint(configs)
  if (!endpoint) throw new Error('Cloudinary storage API URL is not configured')

  const currentUser = firebase.auth().currentUser
  const token = currentUser && await currentUser.getIdToken()
  if (!token) throw new Error('Please login before deleting')

  const response = await fetch(`${endpoint}/delete`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'content-type': 'application/json'
    },
    body: JSON.stringify({ url })
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(body.error || 'Unable to delete image')
}

const isCloudinaryUrl = (url) => {
  return String(url || '').includes('res.cloudinary.com')
}

const actions = ({ store, configs }) => ({
  APP_INIT: async () => {
    !firebase.apps.length && await firebase.initializeApp(configs.firebase)

    const database = firebase.database()
    const auth = firebase.auth()
    const postsRef = database.ref('posts')
    const usersRef = database.ref('users')
    let active = true
    let markAuthReady
    const authReady = new Promise(resolve => { markAuthReady = resolve })

    const handlePosts = snapshot => {
      const posts = snapshot?.val() &&  Object.values(snapshot?.val())
        .reduce((arr, items) => arr.concat(Object.values(items)), [])
        .sort((a, b) => b.id - a.id)
      store.set({ posts })
    }

    const handleUsers = async snapshot => {
      const users = snapshot?.val() && Object.values(snapshot?.val()) || []
      await authReady
      if (!active) return

      const user = auth.currentUser
      await store.set({ users, ready: true, user: user && {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        id: user.uid,
        ...(users.find(item => item.id === user.uid) || {})
      } })
    }

    const stopAuth = auth.onAuthStateChanged(async user => {
      markAuthReady()
      if (!active) return

      if (user && user.emailVerified) {
        await store.set({
          user: {
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            id: user.uid,
            ...((store.get('users') || []).find(item => item.id === user.uid) || {})
          }
        })
      } else {
        auth.signOut()
      }
    })

    postsRef.on('value', handlePosts)
    usersRef.on('value', handleUsers)

    return () => {
      active = false
      postsRef.off('value', handlePosts)
      usersRef.off('value', handleUsers)
      stopAuth()
    }
  },

  APP_SIGNUP_EMAIL_PASSWORD: async (email, password) => {
    if(email && !email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
      return store.set({ error: { type: 'auth', message: 'Please check if your email is written correctly' } })
    if(password && !password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/))
      return store.set({ error: { type: 'auth', message: 'Password is not strong enough (it should contain at least one capital letter and number)' } })

    return firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((credential) => {
        const user = credential.user
        user.sendEmailVerification()
        store.set({ success: { type: 'register', message: 'Congratulations! We sent you an email, please verify and log in' } })
      })
      .catch(
        (error) =>
          (error?.code == 'auth/email-already-in-use')
            ? store.set({ error: { message: error.message = 'This email is used by another unicorn' }})
            : store.set({ error: { message: error.message }})
      )
  },

  APP_LOGIN_EMAIL_PASSWORD: async (email, password) => {
    if(email && !email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
      return store.set({ error: { type: 'auth', message: 'Please check if your email is written correctly' } })

    return firebase.auth().signInWithEmailAndPassword(email, password)
      .then((credential) => {
        const user = credential.user
        if (user.emailVerified) {
          Router?.push('/profile/' + user.uid)
          store.set({ success: { message: 'Done! You successfully logged in' } })
        } else {
          store.set({ error: { message: 'Please verify your email and try again (if you don\'t see an email, check spam folder)' } })
          return false
        }
      })
      .catch(
        (error) => 
          (error?.code == 'auth/user-not-found')
            ? store.set({ error: { message: error.message = 'There is no unicorn with this email' }})
            : (error?.code == 'auth/wrong-password')
              ? store.set({ error: { message: error.message = 'Password incorrect. Try again or reset your password' }})
              : (error?.code == 'auth/too-many-requests')
                ? store.set({ error: { message: error.message = 'You entered wrong password too many times, please take some time to remember' }})
                : store.set({ error: { message: error.message }})
      )
  },

  APP_RESET_PASSWORD: async (email) => {
    if(!email || email && !email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
      return store.set({ error: { type: 'auth', message: 'Please check if your email is written correctly' } })

    return firebase.auth().sendPasswordResetEmail(email)
      .then(function () {
        store.set({ success: { message: 'Please check your email and folow the link to reset your password' } })
      })
      .catch((error) => store.set({ error: { message: error.message }}))
  },

  APP_LOGOUT: async () => {
    return firebase.auth().signOut().then(async () => {
      await store.set({ user: null })
      Router?.push('/')
    })
    .then(function () {
      store.set({ success: { message: 'Done! You successfully logged out' } })
    })
    .catch((error) => store.set({ error: { message: error.message }}))
},

  APP_POST: async (post) => {
    const user = store.get('user')
    if(!user) return store.set({ error: { type: 'post', message: 'Please Login Before Posting' }})
    const id = post.id || new Date().getTime()
    const key = ['posts', user.id, id].join('/')

    if(user.id && post.id)
      return firebase.database().ref(key).update({
        id, userId: user.id,
        updated: new Date().getTime(),
        username: user.username || user.id,
        avatar: user.url || null,
        url: post.url,
        desc: post.desc,
        nsfw: post.nsfw || false
      })
      .then(function () {
        store.set({ success: { message: 'Done! You successfully updated post' } })
      })

    return firebase.database().ref(key).set({
      id, userId: user.id,
      updated: new Date().getTime(),
      username: user.username || user.id,
      avatar: user.url || null,
      url: post.url,
      desc: post.desc,
      nsfw: post.nsfw || false
    })
    .then(function () {
      store.set({ success: { message: 'Done! You successfully uploaded a new image' } })
    })
    .catch(error => store.set({ error: { type: 'post', message: error.message } }))
  },

  APP_DELETEPOST: async post => {
    await firebase.database().ref(`posts/${post.userId}/${post.postId}/`).remove()
    if (isCloudinaryStorage(configs) && isCloudinaryUrl(post.url))
      await deleteFromCloudinary({ configs, url: post.url })
    store.set({ success: { message: 'Done! Your image was successfully removed' } })
  },

  APP_DELETEDRAFTIMAGE: async url => {
    if (isCloudinaryStorage(configs) && isCloudinaryUrl(url))
      await deleteFromCloudinary({ configs, url })
  },

  APP_UPLOAD: async ([ file ], uploading = true) => {
    store.set({ uploading })

    try {
      if(!file?.type?.includes('image/'))
        throw new Error('File that you are uploading is not an image')
      if(file?.size >= 7 * 1024 * 1024 && (!file?.type?.includes('image/gif')))
        throw new Error('File size is too big (maximum size: 7MB)')
      if(file?.size >= 2 * 1024 * 1024 && (file?.type?.includes('image/gif')))
        throw new Error('GIF size is too big (maximum size: 2MB)')

      const resizeFile = (file) => new Promise(resolve => {
        Compress.imageFileResizer(file, 1280, 1280, 'JPEG', 75, 0, uri => {resolve(uri)}, 'file')
      })

      const resizedFile = await (!file?.type?.includes('image/gif') ? resizeFile(file) : file)
      const user = store.get('user') || {}
      if (!isCloudinaryStorage(configs))
        throw new Error('Image storage is not configured')

      const url = await uploadToCloudinary({ configs, file: resizedFile, kind: uploading, user })
      store.set({ uploading: null })
      return url

    } catch(error) {
      store.set({  uploading: null, error: { type: 'upload', message: error.message } })
      return null
    }
  },

  APP_USER: async data => {
    const { id, username } = store.get('user') || {}
    const hasUsername = Object.prototype.hasOwnProperty.call(data, 'username')
    const usernameChanged = hasUsername && data.username !== username

    try {
      const users = store.get('users') || []

      if(hasUsername && !data.username?.match(/^[a-z0-9]{3,15}$/))
        throw new Error('Username should have only lowercase letters, numbers, no spaces and 3 - 15 characters long')
      if(usernameChanged && (data.username === 'unicorn' || users.some(user => user.username === data.username)))
        throw new Error('Username already taken')

      const user = users.find(user => user.id === id) || {}
      const profile = {
        id,
        updated: new Date().getTime(),
        ...data,
        approved: user.approved === true,
      }
      const updates = Object.entries(profile).reduce((result, [field, value]) => {
        if(value !== undefined) result[`users/${id}/${field}`] = value
        return result
      }, {})

      if(usernameChanged) {
        updates[`usernames/${data.username}`] = id
        if(username) updates[`usernames/${username}`] = null
      }

      await firebase.database().ref().update(updates)
      store.set({ success: { message: 'Done! Your profile was successfully updated' } })
      return data.username
    } catch(error) {
      const usernameTaken = usernameChanged && /permission[-_ ]denied/i.test(`${error.code || ''} ${error.message || ''}`)
      store.set({ error: { type: 'username', message: usernameTaken ? 'Username already taken' : error.message }})
      return null
    }
  },

	APP_COUNT: () => store.set({ count: store.get('count') + 1 }),

  APP_LOADING: () => null,

  APP_INFO: (info, type = 'info', duration = 1250) => {
    store.set({ info: info ? { info, type } : null })
    info && setTimeout(() => store.set({ info: null }), duration)
  },
  APP_UPDATE: () => store.set({ update: new Date().getTime() })

})

export default actions
