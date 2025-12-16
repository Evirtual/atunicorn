const withTM = require('next-transpile-modules')(['pack'])

const IGNORED_ENV_KEYS = new Set([
  'NODE_ENV',
  '__CFBundleIdentifier',
  '__CF_USER_TEXT_ENCODING',
  '__NEXT_PROCESSED_ENV',
  'NODE_EXE'
])

const filteredEnv = Object.entries(process.env).reduce((acc, [key, value]) => {
  if (IGNORED_ENV_KEYS.has(key)) return acc
  if (key.startsWith('NEXT_')) return acc
  acc[key] = value
  return acc
}, {})

module.exports = withTM({
  trailingSlash: true,
  output: 'export',
  env: { ...filteredEnv, ENV: process.env.NODE_ENV },
  webpack: config => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web'
    }
    config.resolve.extensions = [ '.web.js', ...config.resolve.extensions ]
    return config
  }
});
