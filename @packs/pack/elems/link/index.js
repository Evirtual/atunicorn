import React, { forwardRef } from 'react'
import { Actheme } from '../../theme'

const Styled = Actheme.create({

  Text: ['Text', 'ta:c c:black fb:500 w:100% fs:s4 nw:s13 lh:s11'],
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
        {...rest}>
        <Component
          onClick={onClick}
          children={
            text
              ? <Styled.Text>{text}</Styled.Text>
              : children
          } />
      </Styled.Link>
    )
  }

})

const Component = forwardRef(({onClick, href, children}, ref) => {  

  return (
    <a 
      href={href}
      onClick={onClick}
      ref={ref}
      style={Actheme.style('display:flex jc,ai:c nw:s13 nh:s11')}
    >
      {children}
    </a>
  )
})

export default Styled.Elem
