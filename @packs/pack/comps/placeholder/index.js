import React from 'react'
import { Actheme } from '../../theme'
import Elems from '../../elems'

const Placeholder = Actheme.create({

  Container: ['View', 'f:1 ai:c w:100% mt:s25', {
    flatlist: 'mt:s2.5',
    modal: 'mt:0 ps:ab'
  }],
  Content: ['View', 'bg:white br:s5 w:100% nh,xw:s90 ai,jc:c bw:1 bc:black50 p:s10', {
    modal: 'bg:grey bc:grey'
  }],
  Text: ['Text', 'c:lightgray fb:500 fs:s5 p:s5', {
    modal: 'c:black250',
    success: 'c:green'
  }],
  Wrap: ['View', 'ai,jc:c ps:fixed l,r,t,b:0 z:999 bg:white'],
  Image: ['Image', 'w,h,br:s50'],

  Comp: (props) => {

    const { icon, spin, title, flatlist, modal, logo, image, success } = props

    return (
      <Placeholder.Container flatlist={flatlist} modal={modal}>
        <Placeholder.Content modal={modal}>
          {(logo || image)
            ? <Placeholder.Image style={Actheme.style('w,h:s50')} source={logo ? '/static/unilogo.gif' : image || null} />
            : <Elems.Icon icon={icon || 'yin-yang'} iconColor="lightgray" iconSize="s30" spin={spin} />
          }
          <Placeholder.Text modal={modal} success={success}>{title || 'Empty'}</Placeholder.Text>
        </Placeholder.Content>
      </Placeholder.Container>
    )
  }
})

export default Placeholder.Comp
