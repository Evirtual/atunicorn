import firebase from 'firebase/app'
import 'firebase/messaging'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import Router from 'next/router'

const actions = ({ store, configs }) => ({
  APP_INIT: async () => {
    !firebase.apps.length && await firebase.initializeApp(configs.firebase)

    firebase.database().ref('posts').on('value', snapshot => {
      const posts = snapshot?.val() &&  Object.values(snapshot?.val())
        .reduce((arr, items) => arr.concat(Object.values(items)), [])
        .sort((a, b) => b.id - a.id)
      store.set({ posts })
    })

    firebase.database().ref('users').on('value', async snapshot => {
      const users = snapshot?.val() && Object.values(snapshot?.val()) || []
      const user = await new Promise(resolve => firebase.auth().onAuthStateChanged(resolve))
      await store.set({ users, ready: true, user: user && {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        id: user.uid,
        ...(users.find(item => item.id === user.uid) || {})
      } })
    })

    firebase.auth().onAuthStateChanged(async user => {
      // await new Promise(r => setTimeout(r, 1000))
      if (user && user.emailVerified) {
        user && await store.set({
          user: {
            name: user.displayName,
            email: user.email,
            photo: user.photoURL,
            id: user.uid,
            ...((store.get('users') || []).find(item => item.id === user.uid) || {})
          }
        })
      } else {
        firebase.auth().signOut();
      }
    })
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
        store.set({ success: { message: 'Congratulations! We sent you an email, please verify and log in' } })
      })
      .catch((error) => store.set({ error: { message: error.message }}))
  },

  APP_LOGIN_EMAIL_PASSWORD: async (email, password) => {
    if(email && !email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/))
      return store.set({ error: { type: 'auth', message: 'Please check if your email is written correctly' } })

    return firebase.auth().signInWithEmailAndPassword(email, password)
      .then((credential) => {
        const user = credential.user
        if (user.emailVerified) {
          Router?.push('/profile/' + user.uid)
        } else {
          store.set({ error: { message: 'Please verify your email and try again (if you don\'t see an email, check spam folder)' } })
        }
      })
      .catch((error) => store.set({ error: { message: error.message }}))
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

  APP_LOGOUT: async () => firebase.auth().signOut().then(async () => {
    await store.set({ user: null })
    Router?.push('/')
  }).catch(),

  APP_POST: async (post = {}) => {
    const user = store.get('user')
    if(!user) return store.set({ error: { type: 'post', message: 'Please Login Before Posting' }})
    const id = new Date().getTime()
    const key = ['posts', user.id, id].join('/')

    return firebase.database().ref(key).set({
      id, userId: user.id,
      username: user.username || user.id,
      url: post.url,
      desc: post.desc,
      nsfw: post.nsfw || false
    }).catch(error => store.set({ error: { type: 'post', message: error.message } }))
  },

  APP_DELETEPOST: async ( post ) => {
    const fileId = post.url.split('%2F').pop().split('?alt=media').shift()
    await firebase.database().ref(`posts/${post.userId}/${post.postId}/`).remove()
    await firebase.storage().ref().child([post.userId, fileId].join('/')).delete()
  },

  APP_UPLOAD: async ([ file ], uploading = true) => {
    store.set({ uploading })
    try {
      if(file.size >= 1 * 1024 * 1024) throw new Error('File size is too big. Please compress or convert to jpeg/PNG (max size: 10MB)')
      if(!file.type.includes('image/')) throw new Error('File type is not an image (recommended format jpeg/PNG)')

      const user = store.get('user') || {}
      const snap = await firebase.storage().ref().child([user.id, new Date().getTime()].join('/')).put(file)
      const url = await snap.ref.getDownloadURL()
      store.set({ uploading: null })
      return url
    } catch(error) {
      store.set({  uploading: null, error: { type: 'upload', message: error.message } })
      return null
    }
  },

  APP_USER: async data => {
    const { id } = store.get('user')
    if(!id) return console.warn('PLEASE LOGIN BEFORE UPDATING PROFILE')
    const user = store.get('users').find(user => user.id === id) || {}

    const key = ['users', id].join('/')

    if(data.username && !data.username.match(/^[a-z0-9]{3,15}$/))
      return store.set({ error: { type: 'username', message: 'Username should have only lowercase letters, numbers, no spaces and 3 - 15 characters long' } })

    // url: data.url || user.url || '',
    // username: data.username || user.username || '',
    // about: data.about || user.about || '',

    return firebase.database().ref(key).update({
      id,
      updated: new Date().getTime(),
      ...data,
      approved: data.approved || user.approved || false
    }, console.log)
    .catch(error => store.set({ error: { type: 'username', message: error.message }}))
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
