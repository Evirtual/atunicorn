import React from 'react'
import { Actheme } from '../../theme'
import Elems from '../../elems'

const Button = Actheme.create({

  Touch: ['TouchableOpacity', 'jc,ai:c nw:s13 nh:s11', {
    submit: 'bc:black250 br:s5 bg:mediumseagreen mt:s5',
    option: 'w,h,nh,nw,br:s8.5 bw:1.75 bg:white400 bc:black c:black',
    edit: 'fs:s4',
    recycle: 'fs:s4.5',
    close: 'fs:s5',
    input: 'nw,nh,br:s9',
    text: 'nw:s13',
    disabled: 'op:0.25',
    inline: 'fd:row',
    nsfw: 'fd:row p:s2 bg:white mt:s5 br:s5 bw:1 bc:black50',
    loadingpost: 'w,h:90vw xw,xh:s90 jc,ai:c bw:1 bc:black50 br:s5 of:hd bg:white m:s2.5',
  }],
  Text: ['Text', ['ta:c c:black fb:500 w:100% fs:s4', { numberOfLines: 1 }], {
    submit: 'c:white',
    inline: 'ml:s2',
    icon: 'ta:l',
    nsfw: 'ml:s2',
  }],
  Image: ['Image', 'w,h:100%'],

  Elem: (props) => {

    const {
      text,
      nsfw,
      submit,
      input,
      option,
      edit,
      recycle,
      close,
      inline,
      disabled,
      loadingpost,
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
        nsfw={nsfw}
        submit={submit}
        input={input}
        option={option}
        recycle={recycle}
        close={close}
        edit={edit}
        inline={inline}
        disabled={disabled}
        loadingpost={loadingpost}
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
          <Elems.Icon
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
            nsfw={nsfw}
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
