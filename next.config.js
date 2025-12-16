const withTM = require('next-transpile-modules')(['pack'])

const CLIENT_ENV_KEYS = [
  // Used by pack/store/configs.js and RN-web AppRegistry name.
  'version',
  'name',
  'description',

  // Used by pack/store/configs.js for API base URL.
  'host',

  // Used by pack/elems/link for asset prefixing.
  'assetPrefix'
]

const clientEnv = CLIENT_ENV_KEYS.reduce((acc, key) => {
  if (typeof process.env[key] !== 'undefined') acc[key] = process.env[key]
  return acc
}, {})

module.exports = withTM({
  trailingSlash: true,
  output: 'export',
  // Only expose explicitly used env vars to the client bundle.
  env: { ...clientEnv, ENV: process.env.NODE_ENV },
  webpack: config => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web'
    }
    config.resolve.extensions = [ '.web.js', ...config.resolve.extensions ]
    return config
  }
});
