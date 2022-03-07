import React from 'react'
import { Actheme } from '../../theme'

const Link = Actheme.create({

  Text: ['Text', 'c:yellow fb:bold fs:s10'],
	Link: 'Link',

  Elem: ({ href, prefetch, replace, scroll, shallow, assetPrefix = process.env.assetPrefix, ...rest }) => {

    return (
      <Styled.Link as={`${assetPrefix || ''}${href}`} href={href} passHref={true} prefetch={prefetch} replace={replace} scroll={scroll} shallow={shallow}>
        <Styled.Text accessibilityRole="link" {...rest} />
      </Styled.Link>
    )
  }

})

export default Link.Elem
