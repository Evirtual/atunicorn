import test from 'node:test'
import assert from 'node:assert/strict'

import {
  normalizePath,
  buildHomeRoute,
  buildProfileRoute,
  buildAboutRoute,
  consumeModalIntent,
  getAboutCloseRoute,
  createModalIntent,
  saveModalIntent,
  resolveRoutePresentation,
} from '../@packs/pack/screens/route-state.js'

test('normalizePath strips query strings and keeps trailing slashes', () => {
  assert.equal(normalizePath('/profile/demo?post=123'), '/profile/demo/')
  assert.equal(normalizePath('/about'), '/about/')
  assert.equal(normalizePath(''), '/')
})

test('buildHomeRoute preserves search and modal post state', () => {
  assert.equal(buildHomeRoute({ search: 'a', postId: '123' }), '/?search=a&post=123')
  assert.equal(buildHomeRoute({ search: 'a' }), '/?search=a')
  assert.equal(buildHomeRoute({}), '/')
})

test('buildProfileRoute serializes profile modal post state', () => {
  assert.equal(buildProfileRoute('demo'), '/profile/demo/')
  assert.equal(buildProfileRoute('demo', { postId: '123' }), '/profile/demo/?post=123')
})

test('about routes resolve consistent close destinations', () => {
  assert.equal(buildAboutRoute(), '/about/')
  assert.equal(buildAboutRoute('demo'), '/profile/demo/about/')
  assert.equal(getAboutCloseRoute(), '/')
  assert.equal(getAboutCloseRoute('demo'), '/profile/demo/')
})

test('home search post route is modal only for matching in-app navigation intent', () => {
  assert.deepEqual(
    resolveRoutePresentation({
      path: '/?search=a&post=123',
      postId: '123',
      modalIntent: createModalIntent({ kind: 'post', ownerPath: '/' }),
    }),
    {
      page: 'home',
      overlay: { kind: 'post', ownerPath: '/' },
      closeHref: '/?search=a'
    }
  )

  assert.deepEqual(
    resolveRoutePresentation({
      path: '/?search=a&post=123',
      postId: '123',
      modalIntent: null,
    }),
    {
      page: 'post',
      overlay: null,
      closeHref: '/?search=a'
    }
  )
})

test('profile query post route is modal only for same-profile intent', () => {
  assert.deepEqual(
    resolveRoutePresentation({
      path: '/profile/demo/?post=123',
      profileId: 'demo',
      postId: '123',
      modalIntent: createModalIntent({ kind: 'post', ownerPath: '/profile/demo/' }),
    }),
    {
      page: 'profile',
      overlay: { kind: 'post', ownerPath: '/profile/demo/' },
      closeHref: '/profile/demo/'
    }
  )

  assert.deepEqual(
    resolveRoutePresentation({
      path: '/profile/demo/?post=123',
      profileId: 'demo',
      postId: '123',
      modalIntent: createModalIntent({ kind: 'post', ownerPath: '/profile/other/' }),
    }),
    {
      page: 'post',
      overlay: null,
      closeHref: '/profile/demo/'
    }
  )
})

test('profile about route is modal only for same-profile intent and page on refresh', () => {
  assert.deepEqual(
    resolveRoutePresentation({
      path: '/profile/demo/about/',
      profileId: 'demo',
      modalIntent: createModalIntent({ kind: 'about', ownerPath: '/profile/demo/' }),
    }),
    {
      page: 'profile',
      overlay: { kind: 'about', ownerPath: '/profile/demo/' },
      closeHref: '/profile/demo/'
    }
  )

  assert.deepEqual(
    resolveRoutePresentation({
      path: '/profile/demo/about/',
      profileId: 'demo',
      modalIntent: null,
    }),
    {
      page: 'about',
      overlay: null,
      closeHref: '/profile/demo/'
    }
  )
})

test('canonical page routes stay pages even when stale modal intent exists', () => {
  assert.deepEqual(
    resolveRoutePresentation({
      path: '/post/123/',
      postId: '123',
      modalIntent: createModalIntent({ kind: 'post', ownerPath: '/' }),
    }),
    {
      page: 'post',
      overlay: null,
      closeHref: '/'
    }
  )

  assert.deepEqual(
    resolveRoutePresentation({
      path: '/about/',
      modalIntent: createModalIntent({ kind: 'about', ownerPath: '/' }),
    }),
    {
      page: 'about',
      overlay: null,
      closeHref: '/'
    }
  )
})

test('modal intent normalizes owner paths and rejects kind mismatches', () => {
  assert.deepEqual(
    createModalIntent({ kind: 'about', ownerPath: '/profile/demo' }),
    { kind: 'about', ownerPath: '/profile/demo/' }
  )

  assert.deepEqual(
    resolveRoutePresentation({
      path: '/profile/demo/about/',
      profileId: 'demo',
      modalIntent: createModalIntent({ kind: 'post', ownerPath: '/profile/demo/' }),
    }),
    {
      page: 'about',
      overlay: null,
      closeHref: '/profile/demo/'
    }
  )
})

test('consumeModalIntent tolerates a repeated read for the same path', () => {
  const storage = new Map()

  global.window = {
    sessionStorage: {
      getItem: (key) => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, value),
      removeItem: (key) => storage.delete(key),
    }
  }

  saveModalIntent('/?search=a&post=123', { kind: 'post', ownerPath: '/' })

  assert.deepEqual(
    consumeModalIntent('/?search=a&post=123'),
    { kind: 'post', ownerPath: '/' }
  )

  assert.deepEqual(
    consumeModalIntent('/?search=a&post=123'),
    { kind: 'post', ownerPath: '/' }
  )

  assert.equal(consumeModalIntent('/?search=a&post=123'), null)

  delete global.window
})