// const DOMAIN = 'test.project.com'
const API_URL = process.env.host || 'http://localhost:5001/bico-24df1/asia-east2'

console.log(API_URL)

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
  }
}

export default configs
