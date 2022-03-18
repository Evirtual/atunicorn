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
      style } = props

    return (
      <Styled.Link
        as={`${assetPrefix || ''}${href}`}
        href={href}
        passHref={true}
        prefetch={prefetch}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        style={style}>
        {text
          ? <Styled.Text accessibilityRole="link">{text}</Styled.Text>
          : props.children
        }
      </Styled.Link>
    )
  }

})

export default Styled.Elem
