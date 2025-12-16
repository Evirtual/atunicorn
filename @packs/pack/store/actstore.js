import React from 'react'

// Minimal local replacement for `actstore`.
// Keeps the subset of the API used by this repo:
//   const { act, store, handle, action } = Actstore(Settings, watchKeys)
//   store.get(...keys), store.set(partial)
//   act('ACTION', ...args)
//   action('ACTION') -> (...args) => act('ACTION', ...args)

let initialized = false
let actions = {}
let handlers = {}
let configs = {}

let state = {}
const listeners = new Set()

const notify = (changedKeys) => {
  listeners.forEach((listener) => {
    try {
      listener(changedKeys)
    } catch (e) {
      // ignore listener errors
    }
  })
}

const storeApi = {
  get: (...keys) => {
    if (!keys.length) return state
    if (keys.length === 1) return state[keys[0]]
    return keys.reduce((acc, key) => {
      acc[key] = state[key]
      return acc
    }, {})
  },
  set: async (partial) => {
    if (!partial || typeof partial !== 'object') return partial
    const changedKeys = Object.keys(partial)
    if (!changedKeys.length) return partial

    state = { ...state, ...partial }

    // Clear only null/undefined (preserve false/0)
    changedKeys.forEach((key) => {
      if (partial[key] === null || typeof partial[key] === 'undefined') {
        delete state[key]
      }
    })

    notify(changedKeys)
    return partial
  }
}

const buildHandle = () => {
  return Object.keys(handlers || {}).reduce((acc, key) => {
    const value = handlers[key]
    acc[key] = typeof value === 'string' ? actions[value] : value
    return acc
  }, {})
}

const act = async (actionName, ...args) => {
  if (typeof actionName !== 'string') {
    const error = new Error('act() requires an action name string')
    if (actions.APP_INFO) actions.APP_INFO({ message: error.message })
    throw error
  }

  const fn = actions[actionName]
  if (!fn) {
    const error = new Error(`Unknown action: ${actionName}`)
    if (actions.APP_INFO) actions.APP_INFO({ message: error.message })
    throw error
  }

  try {
    return await fn(...args)
  } catch (err) {
    if (actions.APP_INFO) {
      actions.APP_INFO({ message: err?.message || String(err) })
    }
    throw err
  }
}

const action = (actionName, ...boundArgs) => {
  return (...args) => act(actionName, ...(boundArgs.length ? boundArgs : args))
}

const initFromArgs = (args = {}) => {
  // First real init wins; subsequent calls keep singleton state/actions.
  if (initialized) return

  const cfgs = args.configs || args.config || {}
  configs = cfgs

  handlers = args.handlers || {}

  // actions factory signature in this repo: ({ store, configs }) => ({ ... })
  const actionFactory = args.actions
  if (typeof actionFactory === 'function') {
    actions = actionFactory({ store: storeApi, configs }) || {}
  } else {
    actions = {}
  }

  initialized = true
}

const useSubscription = (watchKeys) => {
  const [, force] = React.useState(0)

  React.useEffect(() => {
    const watch = Array.isArray(watchKeys) ? watchKeys : []
    const listener = (changedKeys) => {
      if (!watch.length) return force((n) => n + 1)
      if (!Array.isArray(changedKeys) || !changedKeys.length) return
      if (watch.some((k) => changedKeys.includes(k))) force((n) => n + 1)
    }

    listeners.add(listener)
    return () => listeners.delete(listener)
  }, [Array.isArray(watchKeys) ? watchKeys.join('|') : ''])
}

export default function Actstore(args = {}, watchKeys = []) {
  initFromArgs(args)
  useSubscription(watchKeys)

  return {
    act,
    action,
    store: storeApi,
    handle: buildHandle(),
    configs
  }
}
