import React from 'react'
import { Actheme } from '../../theme'

const Styled = Actheme.create({

  Text: ['Text', 'ta:c c:black fb:500 w:100% fs:s4 nw:s14 lh:s10'],
	Link: 'Link',

  Elem: (props) => {

    const {
      href, 
      prefetch, 
      replace, 
      scroll, 
      shallow, 
      assetPrefix = process.env.assetPrefix,
      text,
      icon,
      solid,
      regular,
      iconColor,
      iconSize,
      style,
      children,
      onClick,
      ...rest } = props

    const baseStyle = Actheme.style('display:flex jc,ai:c nw:s11 nh:s10')
    const composedStyle = style ? { ...baseStyle, ...style } : baseStyle

    return (
      <Styled.Link
        href={href}
        prefetch={prefetch}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        onClick={onClick}
        style={composedStyle}
        {...rest}>
        {text ? <Styled.Text>{text}</Styled.Text> : children}
      </Styled.Link>
    )
  }

})

export default Styled.Elem
