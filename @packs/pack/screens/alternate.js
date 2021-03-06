import React from 'react'
import { Elems, Actheme } from 'pack'
import Actstore from 'actstore'

function MainScreen(props) {
  const { store, action } = Actstore({}, ['count'])

  return (
    <Styled.Wrap>
      <Styled.Text>{process.env.description}</Styled.Text>
      <Styled.Link href="/">
        Go back to Main Screen
      </Styled.Link>
      <Styled.Cont>
        <Styled.Button onPress={action('APP_COUNT')}>Click Me to increase number {store.get('count')}</Styled.Button>
        <Styled.Text small aria-level="2">
          {process.env.name} {process.env.version}
        </Styled.Text>
      </Styled.Cont>
    </Styled.Wrap>
  )
}

export default MainScreen

const Styled = Actheme.create({
  Wrap: 'ai,jc:c fg:1',
  Cont: 'mt:s4',
  Text: ['Text', 'fs,mb:s6 ta:c', { small: 'fs:s3'}],
  Button: 'fs,mb:s6 c:green',
  Link: [Elems.Link, 'c:pink']
})
