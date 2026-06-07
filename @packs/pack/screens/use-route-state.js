import { useEffect, useState } from 'react'
import { normalizePath } from './route-state'

const readBrowserPath = () => {
  if (typeof window === 'undefined') {
    return null
  }

  return `${window.location.pathname}${window.location.search}${window.location.hash}`
}

const resolveInitialPath = (router, initialPath) =>
  normalizePath(initialPath || router?.pathname || '/')

export const useRouteState = ({ router, initialPath } = {}) => {
  const [currentPath, setCurrentPath] = useState(resolveInitialPath(router, initialPath))
  const [hasClientPath, setHasClientPath] = useState(false)

  useEffect(() => {
    const nextPath = readBrowserPath()

    if (!nextPath) {
      return
    }

    setHasClientPath(true)
    setCurrentPath(prevPath => prevPath === nextPath ? prevPath : nextPath)
  }, [router?.asPath])

  return { currentPath, hasClientPath }
}
