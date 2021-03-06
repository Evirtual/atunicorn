import actions from './actions'
import configs from './configs'
import Cookies from './cookies'

const store = {
  actions, configs, Cookies,
  handlers: { loading: 'APP_LOADING', info: 'APP_INFO', update: 'APP_UPDATE' }
}

export default store
