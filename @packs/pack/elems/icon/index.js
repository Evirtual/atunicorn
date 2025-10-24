import React, { useEffect, useMemo } from 'react'
import * as Icons from '@phosphor-icons/react'
import { Actheme } from '../../theme'

const iconMap = {
  'arrow-circle-left': Icons.ArrowCircleLeft,
  'arrow-circle-up': Icons.ArrowCircleUp,
  'camera': Icons.Camera,
  'eye-slash': Icons.EyeSlash,
  'home': Icons.House,
  'image-polaroid': Icons.ImageSquare,
  'info-circle': Icons.Info,
  'pencil': Icons.PencilSimple,
  'plus-circle': Icons.PlusCircle,
  'power-off': Icons.Power,
  'recycle': Icons.Recycle,
  'save': Icons.FloppyDisk,
  'search': Icons.MagnifyingGlass,
  'times': Icons.X,
  'times-circle': Icons.XCircle,
  'user-circle': Icons.UserCircle,
  'yin-yang': Icons.YinYang,
  'arrow-left': Icons.ArrowLeft,
  'arrow-up': Icons.ArrowUp,
  'check-circle': Icons.CheckCircle,
  'circle': Icons.Circle,
  'plus': Icons.Plus,
  'info': Icons.Info,
  'user': Icons.User,
  'eye': Icons.Eye,
  'image': Icons.Image,
  'camera-retro': Icons.Camera
}

const defaultIcon = Icons.SquaresFour

const Icon = (props) => {
  const {
    alt,
    regular,
    solid,
    icon,
    name,
    iconColor,
    iconSize,
    weight,
    spin,
    ...rest
  } = props

  const IconComponent = useMemo(() => {
    const key = (icon || name || '').toLowerCase()
    return iconMap[key] || defaultIcon
  }, [icon, name])

  const resolvedWeight = weight
    || (solid ? 'fill' : regular ? 'regular' : 'light')

  const baseStyle = Actheme.style([
    iconSize && `fs:${iconSize}`,
    iconColor && `c:${iconColor}`
  ].filter(Boolean).join(' '))

  useEffect(() => {
    if (!spin || typeof document !== 'object') return
    if (document.getElementById('ph-icon-spin-style')) return
    const styleElement = document.createElement('style')
    styleElement.id = 'ph-icon-spin-style'
    styleElement.textContent = `@keyframes ph-icon-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`
    document.head.appendChild(styleElement)
    return () => {}
  }, [spin])

  const styleObject = Array.isArray(baseStyle)
    ? Object.assign({}, ...baseStyle)
    : { ...(baseStyle || {}) }

  if (spin) {
    styleObject.animation = styleObject.animation || 'ph-icon-spin 0.9s linear infinite'
  }

  return (
    <IconComponent
      aria-label={alt}
      weight={resolvedWeight}
      style={styleObject}
      {...rest}
    />
  )
}

export default Icon
