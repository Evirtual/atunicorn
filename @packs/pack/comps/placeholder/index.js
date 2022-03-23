import React, { useState } from 'react'
import { Actheme } from '../../theme'
import Elems from '../../elems'

const Placeholder = Actheme.create({

  Container: ['View', 'f:1 ai:c w:100% mt:s25', {
    flatlist: 'mt:s2.5'
  }],
  Content: ['View', 'bg:white br:s5 w:100% nh,xw:s90 ai,jc:c bw:1 bc:black50 p:s10'],
  Text: ['Text', 'c:lightgray fb:500 fs:s5 p:s5'],

  Comp: (props) => {

    const { icon, spin, title, flatlist } = props

    return (
      <Placeholder.Container flatlist={flatlist}>
        <Placeholder.Content>
          <Elems.Icon icon={icon || 'yin-yang'} iconColor="lightgray" iconSize="s30" spin={spin} />
          <Placeholder.Text>{title || 'Empty'}</Placeholder.Text>
        </Placeholder.Content>
      </Placeholder.Container>
    )
  }
})

export default Placeholder.Comp
