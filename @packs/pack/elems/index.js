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

const Icon = ({ svg, ...props }) => <FontAwesomeIcon {...props} alt={props.alt} icon={[ (props.solid ? 'fas' : 'fal'), props.icon || props.name]} solid={(props.solid?.toString())} light={(props.light?.toString())} />

const Button = Actheme.create({

  Touch: ['TouchableOpacity', 'jc,ai:c nw:s15 nh:s9.75', {
    info: 'br:s20 ps:ab b,l:s5 z:2',
    user: 'br:s20 ps:ab b,r:s5 z:2',
    post: 'bc:black100 br:s5 bg:mediumseagreen h:s15 mt:s5',
    seeMore : 'mt:s5 mb:s10 w:s50',
    disabled: 'op:0.25',
    inline: 'fd:row',
    nsfw: 'fd:row p:s2 bg:white200 mt:s5 br:s5 bw:1 bc:black50'
  }],
  Text: ['Text', ['ta:c c:black fb:500 w:100% fs:s4', { numberOfLines: 1 }], {
    post: 'c:white fs:s5',
    seeMore: 'c:steelblue fs:s5',
    inline: 'ml:s2',
    nsfw: 'ml:s2',
    icon: 'ta:l' 
  }],
  Image: ['Image', 'w,h:100%'],

  Elem: ({text, source, info, size, icon, solid, iconColor, iconSize, fontSize, textColor, spin, post, disabled, nsfw, inline, onPress, ...props}) => {
    return <Button.Touch info={info} post={post} nsfw={nsfw} inline={inline} disabled={disabled} onPress={!disabled ? onPress : null} {...props}>
      {source && <Button.Image source={source} />}
      {icon && <Icon color={Actheme.value(iconColor, 'color') || 'black'} style={Actheme.style(`fs:${iconSize || 's4'}`)} icon={icon} spin={spin} solid={solid} {...props} />}
      {text && <Button.Text icon={icon} post={post} nsfw={nsfw} inline={inline} style={Actheme.style([
        fontSize && `fs:${fontSize}`, 
        textColor && `c:${textColor}`
      ].filter(item => item).join(' '))} {...props}>{text}</Button.Text>}
    </Button.Touch>
  }

})

export default {
	Link,
	Icon,
	Button: Button.Elem
}
