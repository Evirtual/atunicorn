import React from 'react'
import { Actheme } from '../theme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import * as All from './../resources/svg'

export const Link = ({ href, prefetch, replace, scroll, shallow, assetPrefix = process.env.assetPrefix, ...rest }) => (
	<Styled.Link as={`${assetPrefix || ''}${href}`} href={href} passHref={true} prefetch={prefetch} replace={replace} scroll={scroll} shallow={shallow}>
	  <Styled.Text accessibilityRole="link" {...rest} />
	</Styled.Link>
)

const Styled = Actheme.create({
	Text: ['Text', 'c:yellow fb:bold fs:s10'],
	Link: 'Link'
})

const Icon = ({ svg, ...props }) => <FontAwesomeIcon {...props} alt={props.alt} icon={[ (props.solid ? 'fas' : 'fal'), props.icon || props.name]} solid={(props.solid?.toString())} />

export default {
	Link,
	Icon
}
