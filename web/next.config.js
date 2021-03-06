const withTM = require('next-transpile-modules')(['pack'])

const { NODE_ENV, __CFBundleIdentifier, __CF_USER_TEXT_ENCODING, __NEXT_PROCESSED_ENV, ...env } = process.env

module.exports = withTM({
  env: { ...env, ENV: NODE_ENV },
  webpack: config => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'rnwc'
    }
    config.resolve.extensions = [ '.web.js', ...config.resolve.extensions ]
    return config
  }
});
