import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Icon = (props) => {

  const { svg, onLayout, ...rest } = props

  return (
    <FontAwesomeIcon
    {...rest}
    alt={props.alt}
    icon={[(
      props.regular
        ? 'far'
        : props.brands
          ? 'fab'
          : props.solid
            ? 'fas'
            : 'fal'),
      props.icon || props.name]}
    regular={(props.regular?.toString())}
    solid={(props.solid?.toString())} />
  )
}

export default Icon
