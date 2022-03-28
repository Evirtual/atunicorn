import React, { useState } from 'react'
import { Actheme } from '../../theme'
import Elems from '../../elems'
import Actstore from 'actstore'

const About = Actheme.create({
  Container: ['ScrollView', ['f:1 ps:fixed l,r,t,b:0 z:99 bg:black300 of:hd', {
    contentContainerStyle: Actheme.style('fg:1 w:100% ai,jc:c p:s3')}]],
  Content: ['View', 'w:100% xw:s92 p:s3 bg:grey bw:1 bc:black50 br:s5'],
  Close: ['View', 'ps:ab t,r:s1.5 ai,jc:c z:3'],

  Comp: (props) => {

    const { profile } = props
    const { act } = Actstore({}, ['user'])
    
    const [about, setAbout] = useState()

    return (
      <About.Container>
        <About.Content>
          <About.Close>
            <Elems.Button
              option
              close
              icon="times"
              onPress={props.onClose} />
          </About.Close>
          <Elems.Input
            multiline
            defaultValue={profile?.about || ''}
            onChangeText={setAbout}
            placeholder={`We support markdown\n\n# h1\n## h2\n### h3\n\n*italic*\n**bold**\n\nLink:\n[Title](https://www.example.com)\n\nExample:\n<div align="center">\n### Hello I am unicorn\n**I like to fly**\n[@unicorn](https://www.atunicorn.io)\n</div>\n\nMore details:\nwww.markdownguide.org`}
            style={Actheme.style('nh:s125')} />
          {(about || profile?.about) &&
            <Elems.Button 
              submit
              onPress={() => act('APP_USER', { about: (about || profile?.about || null) }).then(props.onClose)}
              text={profile?.about ? 'Update' : 'Ready to save?'}
              style={Actheme.style('mt:s4')} />
          }
        </About.Content>
      </About.Container>
    )
  }
})

export default About.Comp
