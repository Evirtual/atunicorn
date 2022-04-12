import React from 'react'
import { Actheme } from '../../theme'
import Icon from '../icon'

const Button = Actheme.create({

  Touch: ['TouchableOpacity', 'jc,ai:c nw:s11 nh:s10', {
    submit: 'bc:mediumseagreen br:s5.5 bg:mediumseagreen',
    option: 'w,h,nh,nw,br:s9 bw:2 bg:white400 bc:black c:black',
    edit: 'fs:s4.5',
    recycle: 'fs:s5',
    close: 'fs:s6',
    input: 'nw,nh,br:s9',
    text: 'nw:s14',
    disabled: 'op:0.25',
    inline: 'fd:row',
  }],
  Text: ['Text', ['ta:c c:black fb:500 w:100% fs:s4', { numberOfLines: 1 }], {
    submit: 'c:white',
    inline: 'ml:s2',
    icon: 'ta:l',
  }],
  Image: ['Image', 'w,h:100%'],

  Elem: (props) => {

    const {
      text,
      radio,
      space,
      submit,
      input,
      option,
      edit,
      recycle,
      close,
      inline,
      disabled,
      style,
      onPress,
      imageWidth,
      imageHeight,
      source,
      size,
      icon,
      solid,
      regular,
      iconColor,
      iconSize,
      fontSize,
      textColor,
      ...rest} = props

    return (
      <Button.Touch
        text={text}
        radio={radio}
        submit={submit}
        input={input}
        option={option}
        recycle={recycle}
        close={close}
        edit={edit}
        inline={inline}
        disabled={disabled}
        onPress={!disabled ? onPress : null}
        style={style}
        {...rest}>
        {source &&
          <Button.Image
            source={source}
            style={Actheme.style([
              imageWidth && `w:${imageWidth}`,
              imageHeight && `h:${imageHeight}`
            ].filter(item => item).join(' '))}
            {...rest} />
        }
        {icon &&
          <Icon
            icon={icon}
            solid={solid}
            regular={regular}
            iconColor={iconColor}
            iconSize={iconSize}
            {...rest} />
        }
        {text &&
          <Button.Text
            icon={icon}
            submit={submit}
            inline={inline}
            radio={radio}
            style={Actheme.style([
              fontSize && `fs:${fontSize}`,
              textColor && `c:${textColor}`
            ].filter(item => !!item).join(' '))}
            {...rest}>
              {text}
          </Button.Text>
        }
      </Button.Touch>
    )
  }

})

export default Button.Elem
