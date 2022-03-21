import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Actheme } from '../../theme'

const Icon = (props) => {

  const { svg, onLayout, alt, regular, solid, brands, icon, name, iconColor, iconSize, ...rest } = props

  return (
    <FontAwesomeIcon
      alt={alt}
      icon={[(
        regular
          ? 'far'
          : brands
            ? 'fab'
            : solid
              ? 'fas'
              : 'fal'),
        icon || name]}
      regular={(regular?.toString())}
      solid={(solid?.toString())}
      style={Actheme.style([
        iconSize && `fs:${iconSize}`,
        iconColor && `c:${iconColor}`
      ].filter(item => item).join(' '))}
      {...rest} />
  )
}

export default Icon
