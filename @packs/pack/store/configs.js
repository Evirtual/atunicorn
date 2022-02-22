const DOMAIN = process.env.ENV === 'development' ? 'http://localhost:8080' : 'https://atunicorn.io'
const API_URL = process.env.host || 'http://localhost:5001/unicorn-ee877/asia-east2'

const configs = {
  VER: process.env.version,
  NAME: process.env.name,
  DESC: process.env.description,
  ENV: process.env.ENV,
  // GQL_URL: 'https://' + DOMAIN + '/v1alpha1/graphql',
  // WSS_URL: 'wss://' + DOMAIN + '/v1alpha1/graphql',
  endpoints: {
    balances: API_URL + '/balances',
    trade: API_URL + '/trade',
    cancel: API_URL + '/cancel',
    orders: API_URL + '/orders'
  },
  // auth: DOMAIN + '/auth',
  firebase: {
    apiKey: 'AIzaSyDlYnz7SakCLC_xZsfyVWkRau-B9_LfdXo',
    authDomain: 'atunicorn.io',
    projectId: 'unicorn-ee877',
    storageBucket: 'unicorn-ee877.appspot.com',
    appId: '1:741151279266:web:fdbbd6f71a54a7d712effb',
    databaseUrl: 'https://unicorn-ee877-default-rtdb.firebaseio.com/'
  }
}

export default configs
