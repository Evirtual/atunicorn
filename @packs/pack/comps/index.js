import React from 'react'
import Elems from '../elems'
import { Actheme } from '../theme'
import Actstore from 'actstore'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const Menu = Actheme.create({

  Wrap: ['View', 'bbw:1 bbc:black50 bg:white100', { md: 'fd:row jc:sb' }],
  Tabs: ['View', 'fd:row jc:c p:s5'],

  Comp: ({ router }) => {
    // const { store, action, act, handle } = Actstore({}, [])
    return <Menu.Wrap>
      <Elems.Button icon="alicorn" text="Unicorn" iconColor="pink" logo onPress={() => router?.push('')} />
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
