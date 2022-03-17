import React from 'react'
import { Actheme } from '../../theme'

const Styled = Actheme.create({

  Text: ['Text', 'c:yellow fb:bold fs:s10'],
	Link: 'Link',

  Elem: (props) => {

    const {
      href, 
      prefetch, 
      replace, 
      scroll, 
      shallow, 
      assetPrefix = process.env.assetPrefix, 
      style, 
      ...rest } = props

    return (
      <Styled.Link
        as={`${assetPrefix || ''}${href}`}
        href={href}
        passHref={true}
        prefetch={prefetch}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        style={style}
        {...rest} >
         {/* <Link.Text accessibilityRole="link" {...rest} /> */}
        { props.children }
      </Styled.Link>
    )
  }

})

export default Styled.Elem
