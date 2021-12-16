import actions from './actions'
import configs from './configs'
import Cookies from './cookies'
import Router, { useRouter } from 'next/router'

const store = {
  actions, configs, Cookies,
  handlers: { loading: 'APP_LOADING', info: 'APP_INFO', update: 'APP_UPDATE', useRouter, Router }
}

export default store
