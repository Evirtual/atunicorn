import React from 'react'
import Elems from '../../elems'
import { Actheme } from '../../theme'

const Button = Actheme.create({

  Touch: ['TouchableOpacity', 'jc,ai:c nw:s15 nh:s10', {
    submit: 'bc:lightgray br:s5 bg:mediumseagreen h:s12 mt:s5',
    seeMore : 'mt:s5 mb:s10 w:s50',
    disabled: 'op:0.25',
    inline: 'fd:row',
    nsfw: 'fd:row p:s2 bg:white mt:s5 br:s5 bw:1 bc:black50',
    loadingpost: 'w:100% xw,h:s100 jc,ai:c bw:1 bc:black50 br:s5 of:hd m:s5 bg:white',
    loadingprofile: 'w,h:100% jc,ai:c br:50% fs:s14 c:lightgray',
  }],
  Text: ['Text', ['ta:c c:black fb:500 w:100% fs:s4', { numberOfLines: 1 }], {
    submit: 'c:white',
    inline: 'ml:s2',
    icon: 'ta:l',
    nsfw: 'ml:s2', 
  }],
  Image: ['Image', 'w,h:100%'],
  
  Elem: ({nsfw, text, source, size, icon, solid, iconColor, iconSize, imageWidth, imageHeight, fontSize, textColor, submit, disabled, inline, onPress, loadingpost, loadingprofile, ...props}) => {
    return <Button.Touch nsfw={nsfw} submit={submit} inline={inline} disabled={disabled} loadingpost={loadingpost} loadingprofile={loadingprofile} onPress={!disabled ? onPress : null} {...props}>
      {source && <Button.Image source={source} style={Actheme.style([
        imageWidth && `w:${imageWidth}`, 
        imageHeight && `h:${imageHeight}`
      ].filter(item => item).join(' '))} />}
      {icon && <Elems.Icon color={Actheme.value(iconColor, 'color') || 'black'} style={Actheme.style(`fs:${iconSize || 's4'}`)} icon={icon} solid={solid} {...props} />}
      {text && <Button.Text icon={icon} submit={submit} inline={inline} nsfw={nsfw} style={Actheme.style([
        fontSize && `fs:${fontSize}`, 
        textColor && `c:${textColor}`
      ].filter(item => item).join(' '))} {...props}>{text}</Button.Text>}
    </Button.Touch>
  }

})

export default Button.Elem
