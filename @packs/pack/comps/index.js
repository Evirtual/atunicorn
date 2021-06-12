import React from 'react'
import Elems from '../elems'
import { Actheme } from '../theme'
import Actstore from 'actstore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const Menu = Actheme.create({

  Wrap: ['View', 'bbw:1 bbc:black50 bg:white100', { md: 'fd:row jc:sb' }],
  Tabs: ['View', 'fd:row jc:c p:s5'],
  Content: ['ScrollView', ['f:1', { contentContainerStyle: Actheme.style('fg:1 ai,jc:c fd:row fw:wrap pv:s5 ph:s10 w:100% xw:s400 as:c'), showsVerticalScrollIndicator: false }]],

  Comp: ({ router }) => {
    // const { store, action, act, handle } = Actstore({}, [])
    return <Menu.Wrap>
      <Elems.Button icon="alicorn" text="Unicorn" iconColor="pink" logo onPress={() => router?.push('/')} />
      <Menu.Tabs>
        <Elems.Button tab text="Images" />
        <Elems.Button tab text="Videos" />
      </Menu.Tabs>
    </Menu.Wrap>
  }

})

  


export default {
	Menu: Menu.Comp
}
