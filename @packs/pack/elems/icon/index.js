import React from 'react'
import * as Icons from '@phosphor-icons/react'
import { Actheme } from '../../theme'

const ICON_ALIASES = {
  'arrow-circle-left': 'ArrowCircleLeft',
  'arrow-circle-up': 'ArrowCircleUp',
  camera: 'Camera',
  'eye-slash': 'EyeSlash',
  home: 'House',
  'image-polaroid': 'ImageSquare',
  'info-circle': 'Info',
  pencil: 'Pencil',
  'plus-circle': 'PlusCircle',
  'power-off': 'Power',
  recycle: 'Recycle',
  save: 'FloppyDisk',
  search: 'MagnifyingGlass',
  times: 'X',
  'times-circle': 'XCircle',
  'user-circle': 'UserCircle',
  'yin-yang': 'YinYang'
}

const toComponentName = value => {
  if (!value) return null
  if (ICON_ALIASES[value]) return ICON_ALIASES[value]
  return value
    .split('-')
    .filter(Boolean)
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('')
}

const FallbackIcon = Icons.Question || Icons.Circle || Icons.Smiley

const Icon = props => {
  const {
    alt,
    brands,
    className,
    icon,
    iconColor,
    iconSize,
    name,
    regular,
    solid,
    spin,
    style,
    weight,
    ...rest
  } = props

  const iconKey = name || icon
  const componentName = toComponentName(iconKey)
  const IconComponent = (componentName && Icons[componentName]) || FallbackIcon

  const tokens = [
    iconSize && `fs:${iconSize}`,
    iconColor && `c:${iconColor}`
  ].filter(Boolean).join(' ')

  const themedStyle = tokens ? Actheme.style(tokens) : {}
  const { color, fontSize, ...styleRest } = themedStyle || {}

  const resolvedWeight = weight
    || (solid ? 'fill' : regular ? 'regular' : brands ? 'regular' : 'regular')

  const composedClassName = [className, spin && 'ac-icon-spin']
    .filter(Boolean)
    .join(' ') || undefined

  const inlineStyle = style && typeof style === 'object' ? style : undefined
  const composedStyle = {
    ...styleRest,
    ...(inlineStyle || {})
  }

  const cleanedProps = { ...rest }
  delete cleanedProps.svg
  delete cleanedProps.onLayout

  return (
    <IconComponent
      aria-label={alt}
      className={composedClassName}
      color={cleanedProps.color ?? color}
      size={cleanedProps.size ?? fontSize}
      style={Object.keys(composedStyle).length ? composedStyle : undefined}
      weight={resolvedWeight}
      {...cleanedProps}
    />
  )
}

export default Icon
