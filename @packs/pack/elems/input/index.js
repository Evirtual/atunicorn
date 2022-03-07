import React from 'react'
import { Actheme } from '../../theme'

const Input = Actheme.create({

  TextInput: ['TextInput', ['c:black fs:s4 pv:s2 ph:s5 bw:1 bc:black50 bg:white br:s5 ta:c w:s70', { multiline: false, numberOfLines: 1 }], {
    focus: 'bc:mediumseagreen',
    space: 'mb:s3'
  }],

  Elem: (props) => {
    const [focus, setFocus] = React.useState()

    return <Input.TextInput
      placeholder={props.placeholder || ''}
      focus={focus}
      space={props.space}
      secureTextEntry={props.password}
      onChange={props.onChange}
      onChangeText={props.onChangeText}
      value={props.value}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)} />
  }

})

export default Input.Elem
