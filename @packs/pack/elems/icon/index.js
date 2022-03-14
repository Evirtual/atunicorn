import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Icon = (props) => {

  const { svg, onLayout, alt, regular, solid, brands, icon, name, ...rest } = props

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
    {...rest} />
  )
}

export default Icon
