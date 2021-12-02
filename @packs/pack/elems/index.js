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

  Touch: ['TouchableOpacity', 'jc,ai:c nw:s15', {
    info: 'br:s20 ps:ab b,l:s5 z:2',
    user: 'br:s20 ps:ab b,r:s5 z:2',
    post: 'bc:black100 br:s5 bw:2 bc:pink bg:pink h:s15 mt:s5',
    disabled: 'op:0.25',
    inline: 'fd:row'
  }],
  Text: ['Text', ['ta:c c:black fb:500 w:100%', { numberOfLines: 1 }], {
    post: 'c:white fs:s5',
    inline: 'ml:s2' }],
  Image: ['Image', 'w,h:100%'],

  Elem: ({text, source, info, size, icon, solid, iconColor, iconSize, fontSize, textColor, spin, post, disabled, inline, onPress, ...props}) => {
    return <Button.Touch info={info} post={post} inline={inline} disabled={disabled} onPress={!disabled ? onPress : null} {...props}>
      {source && <Button.Image source={source} />}
      {icon && <Icon color={Actheme.value(iconColor, 'color') || 'black'} style={Actheme.style(`fs:${iconSize || 's4'}`)} icon={icon} spin={spin} solid={solid} {...props} />}
      {text && <Button.Text style={Actheme.style(`fs:${fontSize || 's4'} c:${textColor || 'black'} ${icon && 'ta:l'}`)} post={post} inline={inline}>{text}</Button.Text>}
    </Button.Touch>
  }

})

export default {
	Link,
	Icon,
	Button: Button.Elem
}
