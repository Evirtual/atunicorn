import test from 'node:test'
import assert from 'node:assert/strict'

import {
  normalizePath,
  buildHomeRoute,
  buildProfileRoute,
  buildAboutRoute,
  buildPostRoute,
  getAboutCloseRoute,
} from '../@packs/pack/screens/route-state.js'

test('normalizePath strips query strings and keeps trailing slashes', () => {
  assert.equal(normalizePath('/profile/demo?post=123'), '/profile/demo/')
  assert.equal(normalizePath('/about'), '/about/')
  assert.equal(normalizePath(''), '/')
})

test('route builders produce canonical page routes', () => {
  assert.equal(buildHomeRoute({ search: 'a' }), '/?search=a')
  assert.equal(buildHomeRoute({}), '/')
  assert.equal(buildProfileRoute('demo'), '/profile/demo/')
  assert.equal(buildAboutRoute(), '/about/')
  assert.equal(buildAboutRoute('demo'), '/profile/demo/about/')
  assert.equal(buildPostRoute('123'), '/post/123/')
})

test('about routes resolve consistent close destinations', () => {
  assert.equal(getAboutCloseRoute(), '/')
  assert.equal(getAboutCloseRoute('demo'), '/profile/demo/')
})
