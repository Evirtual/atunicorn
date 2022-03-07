import React from 'react'
import { Actheme } from '../../theme'

const Input = Actheme.create({

  Input: ['TextInput', ['c:black fs:s4 pv:s2 ph:s10 bw:1 bc:black50 bg:white br:s5 ta:c w:s70', { multiline: false, numberOfLines: 1 }], {
    focus: 'bc:mediumseagreen',
    space: 'mb:s3'
  }],

  Elem: (props) => {
    const [focus, setFocus] = React.useState()

    return <Input.Input
      placeholder={props.placeholder || ''}
      focus={focus}
      space={props.space}
      secureTextEntry={props.password}
      onChangeText={props.onChangeText}
      onFocus={() => setFocus(true)}
      onBlur={() => setFocus(false)} />
  }

})

export default Input.Elem
