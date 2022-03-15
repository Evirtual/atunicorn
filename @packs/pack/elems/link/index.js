import React from 'react'
import { Actheme } from '../../theme'

const Link = Actheme.create({

  Text: ['Text', 'c:yellow fb:bold fs:s10'],
	Link: 'Link',

  Elem: (props) => {

    const { href, prefetch, replace, scroll, shallow, assetPrefix = process.env.assetPrefix, ...rest } = props

    return (
      <Link.Link
        as={`${assetPrefix || ''}${href}`}
        href={href}
        passHref={true}
        prefetch={prefetch}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        style={props.style}>
        <Link.Text accessibilityRole="link" {...rest} />
        { children }
      </Link.Link>
    )
  }

})

export default Link.Elem
