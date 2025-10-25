import { getApp, getApps, initializeApp } from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import {
  getDatabase,
  onValue,
  ref as dbRef,
  remove,
  set,
  update
} from 'firebase/database'
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref as storageRef,
  uploadBytes
} from 'firebase/storage'
import Router from 'next/router'
import Compress from "react-image-file-resizer"

let services
let listenersRegistered = false

const getFirebaseServices = (config) => {
  if (!services) {
    const apps = getApps()
    const app = apps.length ? getApp() : initializeApp(config)
    services = {
      app,
      auth: getAuth(app),
      db: getDatabase(app),
      storage: getStorage(app)
    }
  }
  return services
}

const waitForAuthSnapshot = (auth) => new Promise(resolve => {
  const unsubscribe = onAuthStateChanged(auth, user => {
    unsubscribe()
    resolve(user)
  })
})

const actions = ({ store, configs }) => ({
  APP_INIT: async () => {
    const { auth, db } = getFirebaseServices(configs.firebase)

    if (!listenersRegistered) {
      listenersRegistered = true

      onValue(dbRef(db, 'posts'), snapshot => {
        const posts = snapshot?.val() && Object.values(snapshot?.val())
          .reduce((arr, items) => arr.concat(Object.values(items)), [])
          .sort((a, b) => b.id - a.id)
        store.set({ posts })
      })

      onValue(dbRef(db, 'users'), async snapshot => {
        const users = snapshot?.val() && Object.values(snapshot?.val()) || []
        const user = await waitForAuthSnapshot(auth)
        await store.set({ users, ready: true, user: user && {
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          id: user.uid,
          ...(users.find(item => item.id === user.uid) || {})
        } })
      })

      onAuthStateChanged(auth, async user => {
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
        } else if (!user) {
          await store.set({ user: null })
        } else {
          try {
            await signOut(auth)
          } catch (error) {
            console.warn('Failed to sign out unverified user', error)
          }
        }
      })
    }
  },

  APP_SIGNUP_EMAIL_PASSWORD: async (email, password) => {
    if(email && !email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
      return store.set({ error: { type: 'auth', message: 'Please check if your email is written correctly' } })
    if(password && !password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/))
      return store.set({ error: { type: 'auth', message: 'Password is not strong enough (it should contain at least one capital letter and number)' } })

    const { auth } = getFirebaseServices(configs.firebase)

    return createUserWithEmailAndPassword(auth, email, password)
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

    const { auth } = getFirebaseServices(configs.firebase)

    return signInWithEmailAndPassword(auth, email, password)
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

    const { auth } = getFirebaseServices(configs.firebase)

    return sendPasswordResetEmail(auth, email)
      .then(function () {
        store.set({ success: { message: 'Please check your email and folow the link to reset your password' } })
      })
      .catch((error) => store.set({ error: { message: error.message }}))
  },

  APP_LOGOUT: async () => {
    const { auth } = getFirebaseServices(configs.firebase)

    return signOut(auth).then(async () => {
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
    const { db } = getFirebaseServices(configs.firebase)

    if(user.id && post.id)
      return update(dbRef(db, key), {
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

    return set(dbRef(db, key), {
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
    const fileId = post.url.split('%2F').pop().split('?alt=media').shift()
    const { db, storage } = getFirebaseServices(configs.firebase)
    await remove(dbRef(db, `posts/${post.userId}/${post.postId}/`))
    await deleteObject(storageRef(storage, [post.userId, fileId].join('/')))
    store.set({ success: { message: 'Done! Your image was successfully removed' } })
  },

  APP_UPLOAD: async ([ file ], uploading = true) => {
    store.set({ uploading })
    const { storage } = getFirebaseServices(configs.firebase)

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
  const path = [user.id, new Date().getTime()].join('/')
  const reference = storageRef(storage, path)
  await uploadBytes(reference, resizedFile)
  const url = await getDownloadURL(reference)
      store.set({ uploading: null })
      return url

    } catch(error) {
      store.set({  uploading: null, error: { type: 'upload', message: error.message } })
      return null
    }
  },

  APP_USER: async data => {
    const { id, username } = store.get('user')
    try {
      if(data.username && !data.username.match(/^[a-z0-9]{3,15}$/))
        throw new Error('Username should have only lowercase letters, numbers, no spaces and 3 - 15 characters long')
      if(data.username && data.username !== username && (store.get('users').find(user => user.username === data.username)) || data.username === 'unicorn')
        throw new Error('Username already taken')

      const user = store.get('users').find(user => user.id === id) || {}
      const key = ['users', id].join('/')

      const { db } = getFirebaseServices(configs.firebase)

      return update(dbRef(db, key), {
        id,
        updated: new Date().getTime(),
        ...data,
        approved: data.approved || user.approved || false,
      })
      .then(function () {
        store.set({ success: { message: 'Done! Your profile was successfully updated' } })
        return data.username
      })
    } catch(error) {
      store.set({ error: { type: 'username', message: error.message }})
      return null
    }
  },

	APP_COUNT: () => store.set({ count: store.get('count') + 1 }),

  APP_LOADING: () => console.log('loading'),

  APP_INFO: (info, type = 'info', duration = 1250) => {
    store.set({ info: info ? { info, type } : null })
    info && setTimeout(() => store.set({ info: null }), duration)
  },
  APP_UPDATE: () => store.set({ update: new Date().getTime() })

})

export default actions
