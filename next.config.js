const withTM = require('next-transpile-modules')(['pack'])

const { NODE_ENV, __CFBundleIdentifier, __CF_USER_TEXT_ENCODING, __NEXT_PROCESSED_ENV, NODE_EXE, ...env } = process.env

// Only expose client-safe NEXT_PUBLIC_* values alongside the legacy ENV flag.
const filteredEnv = Object.fromEntries(
  Object.entries(env).filter(([key]) => key.startsWith('NEXT_PUBLIC_'))
)

module.exports = withTM({
  trailingSlash: true,
  env: { ...filteredEnv, ENV: NODE_ENV },
  webpack: config => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web'
    }
    config.resolve.extensions = [ '.web.js', ...config.resolve.extensions ]
    return config
  }
});
