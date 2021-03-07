import firebase from 'firebase/app'
import 'firebase/messaging'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

const actions = ({ store, cookies, configs, act }) => ({
  APP_INIT: async () => {
    !firebase.apps.length && await firebase.initializeApp(configs.firebase)
    const user = await new Promise(resolve => firebase.auth().onAuthStateChanged(resolve))

    firebase.database().ref('posts').on('value', snapshot => {
      let posts = []
      snapshot.forEach(child => {
        // const { key } = child
        const list = child.val()
        posts = posts.concat(Object.values({ ...list }))
      })
      store.set({ posts })
    })

    await store.set({
      user: {
        name: user.displayName,
        email: user.email,
        photo: user.photoURL,
        id: user.uid
      }
    })
    //

    // console.log('INIT', data, posts)
    // if(user) return await act('APP_POST')
  },


  APP_LOGIN: async () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly')
    const { credential, user } = await firebase.auth().signInWithPopup(provider)
    console.log('login', user, credential.accessToken)
  },

  APP_POST: async (post = {}) => {
    const { user } = store.get('user') || {}
    if(!user) return console.warn('PLEASE LOGIN BEFORE POSTING')

    const id = new Date().getTime()
    const key = ['posts', user.id, id].join('/')

    return firebase.database().ref(key).set({
      id, userId: user.id,
      url: post.url || 'https://data.lostrelics.io/Items/AbyssalPyre.jpg',
      desc: post.desc || 'testing posts'
    })
  },

  APP_UPLOAD: async ([ file ]) => {
    const user = store.get('user') || {}
    const snap = await firebase.storage().ref().child([user.id, new Date().getTime()].join('/')).put(file)
    const url = await snap.ref.getDownloadURL()
    console.log(url)
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
