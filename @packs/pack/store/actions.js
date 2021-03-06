const actions = ({ store, Cookies, configs }) => ({
  APP_INIT: async () => {
    // const coins = await Cookies.get('coins') || ['BTC', 'LTC', 'ETH', 'UNI', 'CVC', 'ADA', 'BNB', 'XLM', 'GRT', 'SKL', 'SNX', 'VET', 'SUSHI', 'ZIL', '1INCH', 'CRV', 'STX', 'INJ', 'THETA', 'DOT']
    // console.log(typeof coins)
    // await store.set({ count: 1, ready: true, coins: typeof coins === 'string' ? coins.split(',') : coins })
    // const auth = await Cookies.get('token')
    // !!auth && store.set({ auth })
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
