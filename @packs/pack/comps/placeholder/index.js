import React from 'react'
import { Actheme } from '../../theme'
import Elems from '../../elems'
import Markdown from 'markdown-to-jsx';

const Placeholder = Actheme.create({

  Container: ['View', 'bg:white br:s5 w,h:100% ai,jc:c p:s5'],
  Text: ['Text', 'c:black400 ta:c fs:s4', {
    profile: 'fs:s2.25',
  }],
  Image: ['Image', 'w,h,br:s40'],

  Comp: (props) => {

    const {
      icon, 
      spin, 
      title,
      logo, 
      image,
      action, 
      actionText, 
      actionTextColor, 
      desc, 
      disabled,
      profile } = props

    return (
      <Placeholder.Container>
        {(logo || image)
          ? <Placeholder.Image source={logo ? '/static/unilogo.gif' : image || null} />
          : icon &&
            <Elems.Icon icon={icon || 'yin-yang'} iconColor="black100" iconSize={profile ? 's10' : 's30'} spin={spin} />
        }
        {(title || desc) &&
          <Placeholder.Text profile={profile}>
            {title && <Markdown>{title && `### ${title}`}</Markdown>}
            {desc &&<Markdown>{desc}</Markdown>}
          </Placeholder.Text>}
        {action && 
          <Elems.Button 
            text={actionText} 
            onPress={action} 
            disabled={disabled} 
            textColor={actionTextColor || 'lightsalmon'}
            style={Actheme.style('mt:s5')} />
        }
      </Placeholder.Container>
    )
  }
})

export default Placeholder.Comp
