import firebase from 'firebase/app'
import 'firebase/messaging'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import Router from 'next/router'

const actions = ({ store, cookies, configs, act, handle }) => ({
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
      await store.set({ users, user: user && {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        id: user.uid,
        ...(users.find(item => item.id === user.uid) || {})
      } })
    })
  },


  APP_LOGIN: async () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly')
    const { credential, user } = await firebase.auth().signInWithPopup(provider)
    const users = store.get('users')
    user && await store.set({
      user: {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        id: user.uid,
        ...(users.find(item => item.id === user.uid) || {})
      }
    })
    Router?.push('/profile/' + user.uid)
    // console.log('login', user, credential.accessToken)
  },

  APP_LOGOUT: async () => firebase.auth().signOut().then(async data => {
    await store.set({ user: null })
    Router?.push('/')
  }).catch(console.log),

  APP_POST: async (post = {}) => {
    const user = store.get('user')
    if(!user) return store.set({ error: { type: 'post', message: 'Please Login Before Posting' }})
    const id = new Date().getTime()
    const key = ['posts', user.id, id].join('/')

    return firebase.database().ref(key).set({
      id, userId: user.id,
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
      if(file.size > 3.14159 * 1024 * 1024) throw new Error('file size is too big. please compress or convert to jpeg/PNG (max size: 3MB)')
      if(!file.type.includes('image/')) throw new Error('file type is not an image (recommended format jpeg/PNG)')
      
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

    return firebase.database().ref(key).update({
      id,
      updated: new Date().getTime(),
      url: data.url || user.url || '',
      username: data.username || user.username || '',
      about: data.about || user.about || '',
      approved: data.approved || user.approved || false
    }, console.log)
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
