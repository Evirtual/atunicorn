import React, { useState } from 'react'
import { Actheme } from '../../theme'
import Elems from '../../elems'

const Empty = Actheme.create({

  Container: ['View', 'f:1 ai,jc:c mt:s25 mb:s15'],
  Text: ['Text', 'c:lightgray fb:500 fs:s6 p:s5'],

  Comp: (props) => {

    const { icon, title } = props

    return (
      <Empty.Container>
        <Elems.Icon icon={icon || 'yin-yang'} iconColor="lightgray" iconSize="s35" />
        <Empty.Text>{title || 'Empty'}</Empty.Text>
      </Empty.Container>
    )
  }
})

export default Empty.Comp
