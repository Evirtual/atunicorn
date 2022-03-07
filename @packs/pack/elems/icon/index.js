import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Icon = ({ svg, ...props }) => <FontAwesomeIcon {...props} alt={props.alt} icon={[ (props.solid ? 'fas' : props.brands ? 'fab' : 'fal'), props.icon || props.name]} solid={(props.solid?.toString())} />

export default Icon
