import test from 'node:test'
import assert from 'node:assert/strict'

import {
  normalizePath,
  buildHomeRoute,
  buildProfileRoute,
  buildAboutRoute,
  getAboutCloseRoute,
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