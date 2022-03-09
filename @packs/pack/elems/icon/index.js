import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Icon = ({ svg, ...props }) => 
  <FontAwesomeIcon
    {...props}
    alt={props.alt}
    icon={[(
      props.regular
        ? 'far'
        : props.brands
          ? 'fab'
          : props.solid
            ? 'fas'
            : 'fal'),
      props.icon || props.name]} />

export default Icon
