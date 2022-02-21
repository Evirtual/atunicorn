import React from 'react'
import { Comps, Elems, Actheme } from 'pack'
import Actstore from 'actstore'


export default function AuthScreen() {
  const { store, act } = Actstore({}, [])
  React.useEffect(() => { act('APP_AUTH') }, [])
  return null
}
