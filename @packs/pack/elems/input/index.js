import React from 'react'
import { Actheme } from '../../theme'

const Input = Actheme.create({

  TextInput: ['TextInput', 'c:black fs:s4 nh:s10 ph:s5 bw:1 bc:black50 bg:white br:s5 ta:c w:s70', {
    focus: 'bc:mediumseagreen',
    space: 'mb:s3',
    multiline: 'w:auto ta:l pv:s3'
  }],

  Elem: (props) => {
    const [focus, setFocus] = React.useState()

    return <Input.TextInput
      defaultValue={props.defaultValue}
      placeholder={props.placeholder || ''}
      focus={focus}
      space={props.space}
      secureTextEntry={props.password}
      onChange={props.onChange}
      onChangeText={props.onChangeText}
      value={props.value}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)}
      multiline={props.multiline ? true : false}
      numberOfLines={props.numberOfLine ? props.numberOfLine : 1}
      style={props.style} />
  }

})

export default Input.Elem
