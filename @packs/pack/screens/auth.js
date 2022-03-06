import React from 'react'
import Actstore from 'actstore'

export default function AuthScreen() {
  const { act } = Actstore({}, [])
  React.useEffect(() => { act('APP_AUTH') }, [])
  return null
}
