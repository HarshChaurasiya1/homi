/**
 * Lightweight Zero-Dependency Router for HOMI
 * Supports hash-based and clean URL path routing, completely static-host compatible.
 */

import React, { useState, useEffect, useMemo } from 'react'
import type { ReactNode } from 'react'
import { RouterContext, useRouter } from './routerContext'


function normalizePath(raw: string): string {
  // If hash routing is used (e.g. #/delhi or #/places/humayuns-tomb)
  if (raw.startsWith('#')) {
    const clean = raw.slice(1)
    return clean.startsWith('/') ? clean : `/${clean}`
  }
  // Otherwise standard path
  return raw.startsWith('/') ? raw : `/${raw}`
}

function getInitialPath(): string {
  if (typeof window === 'undefined') return '/'
  if (window.location.hash) {
    return normalizePath(window.location.hash)
  }
  if (window.location.pathname && window.location.pathname !== '/') {
    return window.location.pathname
  }
  return '/'
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string>(getInitialPath)

  useEffect(() => {
    function handleLocationChange() {
      if (window.location.hash) {
        setCurrentPath(normalizePath(window.location.hash))
      } else {
        setCurrentPath(window.location.pathname || '/')
      }
    }

    window.addEventListener('hashchange', handleLocationChange)
    window.addEventListener('popstate', handleLocationChange)

    return () => {
      window.removeEventListener('hashchange', handleLocationChange)
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, [])

  const navigate = (to: string) => {
    const target = normalizePath(to)
    if (target === currentPath) return
    window.location.hash = target
    setCurrentPath(target)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Parse path and params
  const { cleanPath, params } = useMemo(() => {
    let extractedSlug = ''
    let parsedPath = currentPath.split('?')[0]

    if (currentPath.startsWith('/places/')) {
      extractedSlug = currentPath.replace('/places/', '').split('/')[0].split('?')[0]
      parsedPath = '/places/:slug'
    }

    const routeParams: Record<string, string> = extractedSlug ? { slug: extractedSlug } : {}
    return { cleanPath: parsedPath, params: routeParams }
  }, [currentPath])



  return (
    <RouterContext.Provider value={{ path: cleanPath, params, navigate }}>
      {children}
    </RouterContext.Provider>
  )
}


export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to: string
  children: ReactNode
  className?: string
  replace?: boolean
}

export const Link: React.FC<LinkProps> = ({ to, children, className, ...rest }) => {
  const { navigate } = useRouter()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If external link or anchor on same page, let browser handle
    if (to.startsWith('http') || to.startsWith('mailto:') || to.startsWith('tel:')) {
      return
    }
    e.preventDefault()
    navigate(to)
  }

  const href = to.startsWith('http') || to.startsWith('mailto:') ? to : `#${normalizePath(to)}`

  return (
    <a href={href} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  )
}
