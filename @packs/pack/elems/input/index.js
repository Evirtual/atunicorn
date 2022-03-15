import React from 'react'
import { Actheme } from '../../theme'

const Input = Actheme.create({

  TextInput: ['TextInput', 'c:black fs:s4 nh:s10 ph:s5 bw:1 bc:black50 bg:white br:s5 ta:c w:100% xw:s70', {
    focus: 'bc:mediumseagreen',
    space: 'mb:s3',
    multiline: 'xw:none ta:l pv:s3'
  }],

  Elem: (props) => {

    const {
      defaultValue,
      placeholder, 
      space, 
      password, 
      onChange, 
      onChangeText, 
      value, 
      multiline, 
      numberOfLine, 
      style, 
      ...rest} = props
      
    const [focus, setFocus] = React.useState()

    return (
      <Input.TextInput
        defaultValue={defaultValue}
        placeholder={placeholder || ''}
        focus={focus}
        space={space}
        secureTextEntry={password}
        onChange={onChange}
        onChangeText={onChangeText}
        value={value}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        multiline={multiline ? true : false}
        numberOfLines={numberOfLine ? numberOfLine : 1}
        style={style}
        {...rest} />
    )
  }

})

export default Input.Elem
