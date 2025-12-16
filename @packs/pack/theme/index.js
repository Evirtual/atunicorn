import React from 'react'
import * as RN from 'react-native'
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components'
import Multies from './multies'

const STORAGE_KEY_MODE = 'atunicorn.theme.mode'
const STORAGE_KEY_COLORS = 'atunicorn.theme.colors'

const BASE_ALPHAS = {
  400: 0.8,
  300: 0.6,
  250: 0.5,
  200: 0.4,
  100: 0.2,
  50: 0.1,
  25: 0.05,
  15: 0.03,
  10: 0.02,
  5: 0.015
}

const BASE_SCALE = 4

const LIGHT_COLORS = {
  white: 'rgba(255, 255, 255, 1)',
  black: 'rgba(34, 34, 34, 1)',
  grey: 'rgba(242, 242, 242, 1)',
  red: 'rgba(255, 99, 71, 1)',
  green: 'rgba(60, 179, 113, 1)',
  blue: 'rgba(70, 130, 180, 1)'
}

const DARK_COLORS = {
  white: 'rgba(34, 34, 34, 1)',
  black: 'rgba(242, 242, 242, 1)',
  grey: 'rgba(20, 20, 20, 1)',
  red: 'rgba(255, 99, 71, 1)',
  green: 'rgba(60, 179, 113, 1)',
  blue: 'rgba(70, 130, 180, 1)'
}

const safeJsonParse = (value, fallback) => {
  try {
    return JSON.parse(value)
  } catch {
    return fallback
  }
}

const isBrowser = typeof window === 'object'

const buildSizes = (scale) => {
  const result = {
    's0.25': scale * 0.25,
    's0.5': scale * 0.5,
    's0.75': scale * 0.75
  }
  for (let i = 1; i <= 200; i++) {
    result[`s${i}`] = i * scale
    result[`s${i + 0.25}`] = (i + 0.25) * scale
    result[`s${i + 0.5}`] = (i + 0.5) * scale
    result[`s${i + 0.75}`] = (i + 0.75) * scale
  }
  return result
}

const rgbaToParts = (rgba) => {
  const match = String(rgba)
    .replace(/\s+/g, '')
    .match(/^rgba\((\d+),(\d+),(\d+),(\d*\.?\d+)\)$/i)
  if (!match) return null
  return {
    r: Number(match[1]),
    g: Number(match[2]),
    b: Number(match[3]),
    a: Number(match[4])
  }
}

const applyAlpha = (rgba, alpha) => {
  const parts = rgbaToParts(rgba)
  if (!parts) return rgba
  return `rgba(${parts.r}, ${parts.g}, ${parts.b}, ${alpha})`
}

const buildAlphaColors = (colors, alphas) => {
  const res = { ...colors }
  Object.keys(colors).forEach((name) => {
    const base = colors[name]
    Object.keys(alphas).forEach((k) => {
      const alpha = alphas[k]
      res[`${name}${k}`] = applyAlpha(base, alpha)
    })
  })
  return res
}

const STYLE_PROPS = {
  d: 'display',
  dp: 'display',

  w: 'width',
  h: 'height',

  t: 'top',
  l: 'left',
  r: 'right',
  b: 'bottom',

  nw: 'minWidth',
  xw: 'maxWidth',
  nh: 'minHeight',
  xh: 'maxHeight',

  m: 'margin',
  mv: 'marginVertical',
  mh: 'marginHorizontal',
  mt: 'marginTop',
  mb: 'marginBottom',
  ml: 'marginLeft',
  mr: 'marginRight',

  p: 'padding',
  pv: 'paddingVertical',
  ph: 'paddingHorizontal',
  pt: 'paddingTop',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  pr: 'paddingRight',

  ps: 'position',

  f: 'flex',
  fd: 'flexDirection',
  fw: 'flexWrap',
  jc: 'justifyContent',
  ai: 'alignItems',
  as: 'alignSelf',
  ac: 'alignContent',
  of: 'overflow',
  fg: 'flexGrow',
  fsk: 'flexShrink',
  fb: 'flexBasis',

  ar: 'aspectRatio',
  z: 'zIndex',

  dir: 'direction',

  bg: 'backgroundColor',

  bw: 'borderWidth',
  btw: 'borderTopWidth',
  brw: 'borderRightWidth',
  bbw: 'borderBottomWidth',
  blw: 'borderLeftWidth',

  bc: 'borderColor',
  btc: 'borderTopColor',
  brc: 'borderRightColor',
  bbc: 'borderBottomColor',
  blc: 'borderLeftColor',

  br: 'borderRadius',
  btlr: 'borderTopLeftRadius',
  btrr: 'borderTopRightRadius',
  bblr: 'borderBottomLeftRadius',
  bbrr: 'borderBottomRightRadius',

  bs: 'borderStyle',
  op: 'opacity',
  el: 'elevation',

  // text
  ff: 'fontFamily',
  fs: 'fontSize',
  ta: 'textAlign',
  c: 'color',
  fst: 'fontStyle',
  fv: 'fontVariant',
  ls: 'letterSpacing',
  lh: 'lineHeight',
  tav: 'textAlignVertical',
  ifp: 'includeFontPadding',
  tdl: 'textDecorationLine',
  tds: 'textDecorationStyle',
  tdc: 'textDecorationColor',
  wd: 'writingDirection',
  tt: 'textTransform',

  rm: 'resizeMode',

  // transition (web only)
  ts: 'transition'
}

const VALUE_ALIASES = {
  c: 'center',
  col: 'column',
  fe: 'flex-end',
  fs: 'flex-start',
  sb: 'space-between',
  sa: 'space-around',
  ab: 'absolute',
  rl: 'relative',
  hd: 'hidden',
  uc: 'uppercase',
  cp: 'capitalize',
  ul: 'underline',
  cv: 'cover',
  norm: 'normal',
  wp: 'wrap',
  gd: 'grid'
}

let currentTheme = {
  mode: 'light',
  scale: BASE_SCALE,
  alphas: BASE_ALPHAS,
  size: buildSizes(BASE_SCALE),
  color: buildAlphaColors(LIGHT_COLORS, BASE_ALPHAS),
  medias: { sm: 400, md: 768, lg: 1024, xl: 1280 }
}

const resolveValue = (rawValue, propName, theme) => {
  if (rawValue === true) return true
  if (rawValue === null || typeof rawValue === 'undefined') return rawValue

  const value = String(rawValue)

  const sizeMatch = value.match(/^(-)?s(\d+(?:\.\d+)?)$/)
  if (sizeMatch) {
    const sign = sizeMatch[1] ? -1 : 1
    const key = `s${sizeMatch[2]}`
    const num = (theme?.size && theme.size[key]) || (currentTheme.size && currentTheme.size[key])
    return typeof num === 'number' ? sign * num : sign * Number(sizeMatch[2]) * (theme?.scale || currentTheme.scale || 1)
  }

  const themedColor = theme?.color?.[value] || currentTheme.color?.[value]
  if (themedColor) return themedColor

  if (VALUE_ALIASES[value]) return VALUE_ALIASES[value]

  if (/^-?\d+(?:\.\d+)?$/.test(value)) {
    if (propName === 'fontWeight') return value
    return Number(value)
  }

  return value
}

const parseToken = (token, theme) => {
  if (!token) return {}

  const text = String(token).trim()
  if (!text) return {}

  const hasColon = text.includes(':')
  const left = hasColon ? text.split(':')[0] : text
  const right = hasColon ? text.split(':').slice(1).join(':') : true

  const keys = left.split(',').map((k) => k.trim()).filter(Boolean)

  return keys.reduce((acc, shortKey) => {
    const prop = STYLE_PROPS[shortKey] || shortKey
    const finalProp = shortKey === 'fb' ? 'fontWeight' : prop
    const finalValue = resolveValue(right, finalProp, theme)
    acc[finalProp] = finalValue
    return acc
  }, {})
}

const mergeStyles = (styles) => {
  const out = {}
  styles.filter(Boolean).forEach((st) => {
    if (Array.isArray(st)) {
      Object.assign(out, mergeStyles(st))
      return
    }
    if (typeof st === 'object') {
      Object.assign(out, st)
    }
  })
  return out
}

const style = (input, theme) => {
  if (!input) return {}
  if (typeof input === 'object' && !Array.isArray(input)) return input

  const str = Array.isArray(input) ? input.filter(Boolean).join(' ') : String(input)
  const tokens = str.split(/\s+/).filter(Boolean)
  return mergeStyles(tokens.map((t) => parseToken(t, theme)))
}

const resolveType = (typeName) => {
  if (typeName === 'RefFlatList') {
    const FlatList = RN.FlatList
    return React.forwardRef((props, ref) => <FlatList ref={ref} {...props} />)
  }
  if (Multies && Multies[typeName]) return Multies[typeName]
  return RN[typeName] || typeName
}

const normalizeDef = (def) => {
  if (typeof def === 'string') return { type: def }
  if (typeof def === 'function') return { comp: def }
  if (Array.isArray(def)) {
    const [type, base, variants] = def
    if (Array.isArray(base)) {
      const [baseStyle, baseProps] = base
      return { type, baseStyle, baseProps: baseProps || {}, variants: variants || {} }
    }
    return { type, baseStyle: base, baseProps: {}, variants: variants || {} }
  }
  if (def && typeof def === 'object') return def
  return {}
}

const normalizeExtraProps = (props, theme) => {
  if (!props || typeof props !== 'object') return props
  return Object.keys(props).reduce((acc, key) => {
    const value = props[key]
    if (typeof value === 'string' && /Style$/.test(key)) {
      acc[key] = style(value, theme)
      return acc
    }
    acc[key] = value
    return acc
  }, {})
}

const create = (comps) => {
  return Object.keys(comps).reduce((acc, key) => {
    const spec = normalizeDef(comps[key])
    if (spec.comp && typeof spec.comp === 'function') {
      acc[key] = spec.comp
      return acc
    }

    const Node = resolveType(spec.type)

    // Next.js `Link` uses an `as` prop for routing. styled-components also uses `as`
    // for polymorphic rendering, which can turn route strings (e.g. `/about/`) into
    // invalid DOM tags during SSR. Avoid styling Link altogether.
    if (spec.type === 'Link') {
      acc[key] = Node
      return acc
    }

    const baseProps = spec.baseProps || {}
    const variants = spec.variants || {}

    const Styled = styled(Node).attrs((props) => {
      const theme = props.theme || currentTheme
      const baseStyleObj = typeof spec.baseStyle === 'string' ? style(spec.baseStyle, theme) : spec.baseStyle
      const variantStyles = Object.keys(variants)
        .filter((variantName) => props[variantName])
        .map((variantName) => style(variants[variantName], theme))
      const extraProps = normalizeExtraProps(baseProps, theme)
      const composedStyle = mergeStyles([baseStyleObj, ...variantStyles, props.style])

      return {
        ...extraProps,
        style: Object.keys(composedStyle).length ? composedStyle : undefined
      }
    })``

    acc[key] = Styled
    return acc
  }, {})
}

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = React.useState('light')
  const [customColors, setCustomColors] = React.useState({})

  React.useEffect(() => {
    if (!isBrowser) return
    const storedMode = window.localStorage.getItem(STORAGE_KEY_MODE)
    if (storedMode === 'dark' || storedMode === 'light') setMode(storedMode)
    const storedColors = window.localStorage.getItem(STORAGE_KEY_COLORS)
    const parsed = storedColors ? safeJsonParse(storedColors, {}) : {}
    if (parsed && typeof parsed === 'object') setCustomColors(parsed)
  }, [])

  React.useEffect(() => {
    if (!isBrowser) return
    window.localStorage.setItem(STORAGE_KEY_MODE, mode)
  }, [mode])

  React.useEffect(() => {
    if (!isBrowser) return
    window.localStorage.setItem(STORAGE_KEY_COLORS, JSON.stringify(customColors || {}))
  }, [customColors])

  const baseColors = mode === 'dark' ? DARK_COLORS : LIGHT_COLORS
  const mergedColors = { ...baseColors, ...(customColors || {}) }
  const themed = {
    mode,
    scale: BASE_SCALE,
    alphas: BASE_ALPHAS,
    size: buildSizes(BASE_SCALE),
    color: buildAlphaColors(mergedColors, BASE_ALPHAS),
    medias: { sm: 400, md: 768, lg: 1024, xl: 1280 },
    setMode,
    setCustomColors
  }

  currentTheme = themed

  return <StyledThemeProvider theme={themed}>{children}</StyledThemeProvider>
}

export const useThemeConfig = () => {
  const theme = currentTheme
  return {
    mode: theme.mode,
    setMode: theme.setMode,
    colors: theme.color,
    setColors: theme.setCustomColors
  }
}

export const Actheme = {
  create,
  style
}
