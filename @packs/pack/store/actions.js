import firebase from 'firebase/app'
import 'firebase/messaging'
import 'firebase/auth'
import 'firebase/database'

const actions = ({ store, cookies, configs, act }) => ({
  APP_INIT: async () => {
    !firebase.apps.length && await firebase.initializeApp(configs.firebase)
    const user = await new Promise(resolve => firebase.auth().onAuthStateChanged(resolve))

    let posts = []

    firebase.database().ref('posts').on('value', snapshot => {
      snapshot.forEach(child => {
        // const { key } = child
        posts = posts.concat(Object.values(child.val()))
      })
    })

    const data = await store.set({
      posts,
      user: {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        id: user.uid
      }
    })

    // console.log(data)
    // if(user) return await act('APP_POST')
  },

  APP_LOGIN: async () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly')
    const { credential, user } = await firebase.auth().signInWithPopup(provider)
    console.log('login', user, credential.accessToken)
  },

  APP_POST: async (post = {}) => {
    const { user, database } = store.get('user', 'database') || {}
    if(!user) return console.warn('PLEASE LOGIN BEFORE POSTING')

    const id = new Date().getTime()
    const key = ['posts', user.id, id].join('/')

    return firebase.database().ref(key).set({
      id, userId: user.id,
      url: post.url || 'https://data.lostrelics.io/Items/AbyssalPyre.jpg',
      desc: post.desc || 'testing posts'
    })
  },

	APP_COUNT: () => store.set({ count: store.get('count') + 1 }),

  APP_LOADING: () => console.log('loading'),

  APP_INFO: (info, type = 'info', duration = 1250) => {
    console.log(info, type)
    store.set({ info: info ? { info, type } : null })
    info && setTimeout(() => store.set({ info: null }), duration)
  },
  APP_UPDATE: () => store.set({ update: new Date().getTime() })

})

export default actions
