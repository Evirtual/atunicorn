import React from 'react'
import { Elems, Actheme } from 'pack'
import Actstore from 'actstore'
import { GET } from 'fetchier'

function MainScreen(props) {
  const { store, action, act, handle } = Actstore({}, ['update', 'info'])

  const info = store.get('info')

  return <>
    <Inner.Wrap>
      <Inner.Cont>
        <Foot.Comp />
      </Inner.Cont>
    </Inner.Wrap>
    {info && <Inner.Info onPress={() => handle.info()} error={type === 'error'}>{info}</Inner.Info>}
  </>
}
export default MainScreen

const Inner = Actheme.create({
  Wrap: ['View', 'f:1 w:100% as:c p:s1 ps:rl', { md: 'xw:s250'}],
  Cont: 'fg:1 bg:black50 br:s2',
  Scroll: ['ScrollView', ['f:1', { contentContainerStyle: Actheme.style('ai,jc:c pb:s5') }]],
  ScrollWrap: ['View', 'jc:c fd:row mh:s2 fw:wp w:100%'],
  Info: ['Text', 'bg:white c:black p:s2 m:s1 ps:ab b,l,r:0 ta:c fb:bold', { error: 'c:red' }],
  Touch: ['TouchableOpacity', 'bg:black50 br:s0.5 c:white ph:s2 pt:s1.5 pb:s2 f:1 xw:s10 ta:c as:c fs:s3', {
    bright: 'bg:black400', clear: 'bg:ts bw:0.5 bc:black50 c:black200', long: 'xw:s20',
    space: 'mh:s1',
    slim: 'mt:s2 pt:s0.5 pb:s1 as:fs'
  }],
  Text: ['Text', ['c:white ta:c w:100%', { numberOfLines: 1 }], { clear: 'c:black400', slim: 'fs:s3' }],
  Button: ({ children, ...props }) => <Inner.Touch {...props}><Inner.Text clear={props.clear} slim={props.slim}>{children}</Inner.Text></Inner.Touch>
})

const Foot = Actheme.create({
  Wrap: 'ps:ab b,r:0',
  Text: ['Text', 'pl:s1.5 pr:s0.5 c:black300 fs:s2 bg:white btlr:s0.5'],
  Comp: () => {
    const { configs = {} } = Actstore({}, [])
    return <Foot.Wrap>
      <Foot.Text>{configs?.NAME} v{configs?.VER}</Foot.Text>
    </Foot.Wrap>
  }
})
