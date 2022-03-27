import React, { useState } from 'react'
import { Actheme } from '../../theme'

const Input = Actheme.create({

  TextInput: ['TextInput', 'c:black fs:s4 nh:s11 ph:s3.5 bw:1 bc:black50 bg:white br:s5.5 ta:c w:100%', {
    focus: 'bc:mediumseagreen',
    space: 'mb:s3',
    multiline: 'ta:l pv:s3 br:s3.5'
  }],

  Elem: (props) => {

    const {
      defaultValue,
      placeholder, 
      space, 
      onContentSizeChange,
      password, 
      onChange, 
      onChangeText, 
      value, 
      multiline, 
      numberOfLine, 
      style,
      ...rest} = props
      
    const [focus, setFocus] = useState()

    return (
      <Input.TextInput
        defaultValue={defaultValue}
        placeholder={placeholder || ''}
        focus={focus}
        space={space}
        onContentSizeChange={onContentSizeChange}
        secureTextEntry={password}
        onChange={onChange}
        onChangeText={onChangeText}
        value={value || null}
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
