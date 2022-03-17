import React from 'react'
import { Actheme } from '../../theme'
import Elems from '../../elems'
import Actstore from 'actstore'

const About = Actheme.create({
  Container: ['ScrollView', ['f:1 ps:fixed l,r,t,b:0 z:99 bg:black300 of:hd', {
    contentContainerStyle: Actheme.style('fg:1 w:100% ai,jc:c p:s5')}]],
  Content: ['View', 'w:100% xw:s90 p:s4 bg:#F2F2F2 bw:1 bc:black50 br:s5'],
  Close: ['View', 'w,h,br:s8 bg:black200 ps:ab t,r:s2 ai,jc:c z:3'],

  Comp: (props) => {

    const { profile } = props
    const { act } = Actstore({}, ['user'])
    const [about, setAbout] = React.useState()

    return (
      <About.Container>
        <About.Content>
          <About.Close>
            <Elems.Button
              remove
              icon="times"
              iconSize="s5"
              color="white"
              onPress={props.onClose} />
          </About.Close>
          <Elems.Input
            multiline
            numberOfLine={15}
            defaultValue={profile?.about || ''}
            onChangeText={setAbout}
            placeholder={profile?.about || 'What makes you tick?'} />
          {about &&
            <Elems.Button 
              submit
              onPress={() => act('APP_USER', { about }).then(props.onClose)}
              text="Ready to save?" />
          }
        </About.Content>
      </About.Container>
    )
  }
})

export default About.Comp
