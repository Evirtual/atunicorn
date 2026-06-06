import React from 'react'
import { Actheme } from '../../theme'

const Styled = Actheme.create({

  Text: ['Text', 'ta:c c:black fb:500 w:100% fs:s4 nw:s14 lh:s10'],
	Link: 'Link',

  Elem: (props) => {

    const {
      href, 
      as: linkAs,
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

    return (
      <Styled.Link
        as={`${assetPrefix || ''}${linkAs || href}`}
        href={href}
        prefetch={prefetch}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        style={style}
        onClick={onClick}
        className={rest.className}
        {...rest}>
        {text
          ? <Styled.Text>{text}</Styled.Text>
          : children
        }
      </Styled.Link>
    )
  }

})

export default Styled.Elem
