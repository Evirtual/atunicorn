import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import actions from './actions'
import configs from './configs'
import Cookies from './cookies'
import Router, { useRouter } from 'next/router'

const initialState = {
  ready: false,
  user: null,
  users: [],
  posts: [],
  uploading: null,
  error: null,
  success: null,
  info: null,
  update: null,
  count: 0
}

const store = {
  actions,
  configs,
  Cookies,
  initialState,
  handlers: { loading: 'APP_LOADING', info: 'APP_INFO', update: 'APP_UPDATE', useRouter, Router }
}

const StoreContext = createContext(null)

const mergeState = (prev, next) => {
  const value = typeof next === 'function' ? next(prev) : next
  if (!value || typeof value !== 'object') return { ...prev }
  return { ...prev, ...value }
}

export const StoreProvider = ({ children, initialState: override = {} }) => {
  const [state, setState] = useState(() => mergeState(store.initialState, override))
  const stateRef = useRef(state)
  stateRef.current = state

  const set = useCallback((update) => new Promise(resolve => {
    setState(prev => {
      const nextState = mergeState(prev, update)
      stateRef.current = nextState
      resolve(nextState)
      return nextState
    })
  }), [])

  const get = useCallback((...keys) => {
    const current = stateRef.current
    if (!keys.length) return current
    if (keys.length === 1) return current[keys[0]]
    return keys.reduce((acc, key) => {
      acc[key] = current[key]
      return acc
    }, {})
  }, [])

  const storeApi = useMemo(() => ({ get, set }), [get, set])

  const actionMap = useMemo(() => {
    const createActions = typeof store.actions === 'function' ? store.actions : () => ({})
    return createActions({ store: storeApi, configs: store.configs }) || {}
  }, [storeApi])

  const act = useCallback((type, ...args) => {
    const fn = actionMap[type]
    if (typeof fn !== 'function') {
      console.warn(`[store] Missing action "${type}"`)
      return Promise.resolve()
    }
    try {
      const result = fn(...args)
      return result instanceof Promise ? result : Promise.resolve(result)
    } catch (error) {
      return Promise.reject(error)
    }
  }, [actionMap])

  const action = useCallback((type, ...preset) => (...extra) => act(type, ...preset, ...extra), [act])

  const handlers = useMemo(() => {
    const base = store.handlers || {}
    return Object.keys(base).reduce((acc, key) => {
      const value = base[key]
      acc[key] = typeof value === 'string' ? (...args) => act(value, ...args) : value
      return acc
    }, {})
  }, [act])

  const contextValue = useMemo(() => ({
    state,
    store: storeApi,
    act,
    action,
    handle: handlers,
    cookies: store.Cookies
  }), [state, storeApi, act, action, handlers])

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStoreContext = () => {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStoreContext must be used within StoreProvider')
  return context
}

export const useStore = () => {
  const { act, action, store: storeApi, handle } = useStoreContext()
  return { act, action, store: storeApi, handle }
}

export { StoreContext }

export default store
