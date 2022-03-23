import React, { useState } from 'react'
import { Actheme } from '../../theme'
import Elems from '../../elems'

const Empty = Actheme.create({

  Container: ['View', 'f:1 ai:c mt:s24 w:100%'],
  Content: ['View', 'bg:white br:s5 w:100% nh,xw:s90 ai,jc:c bw:1 bc:black50 p:s10'],
  Text: ['Text', 'c:lightgray fb:500 fs:s6 p:s5'],

  Comp: (props) => {

    const { icon, title } = props

    return (
      <Empty.Container>
        <Empty.Content>
          <Elems.Icon icon={icon || 'yin-yang'} iconColor="lightgray" iconSize="s30" />
          <Empty.Text>{title || 'Empty'}</Empty.Text>
        </Empty.Content>
      </Empty.Container>
    )
  }
})

export default Empty.Comp
