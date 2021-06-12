import React from 'react'
import { Actheme } from '../theme'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

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

const Button = Actheme.create({

  Touch: ['TouchableOpacity', 'jc,ai:c', {
    tab: 'mh:s5 fs:s20',
    info: 'bg:#e5e5e5 br:s20 ps:ab b,l:s5 z:2',
    user: 'bg:#e5e5e5 br:s20 ps:ab b,r:s5 z:2',
    logo: 'as:c m:s5 w,h:s15',
    post: 'bc:black100 br:s5 bw:2 bc:pink bg:pink h:s15',
    disabled: 'op:0.25'
  }],
  Text: ['Text', ['ta:c c:black fb:500 w:100%', { numberOfLines: 1 }], {
    tab: 'fs:s5',
    logo: 'c:pink',
    post: 'c:white fs:s5' }],
  Image: ['Image', 'w,h:100%'],

  Elem: ({text, source, info, logo, size, icon, iconColor, iconSize, spin, tab, post, disabled, onPress, ...props}) => {
    return <Button.Touch info={info} logo={logo} tab={tab} logo={logo} post={post} disabled={disabled} onPress={!disabled ? onPress : null} {...props}>
      {source && <Button.Image source={source} />}
      {icon && <Icon color={Actheme.value(iconColor, 'color') || 'black'} style={Actheme.style(`fs:${iconSize || 's10'}`)} icon={icon} spin={spin} />}
      {text && <Button.Text tab={tab} logo={logo} post={post} {...props}>{text}</Button.Text>}
    </Button.Touch>
  }

})

export default {
	Link,
	Icon,
	Button: Button.Elem
}
