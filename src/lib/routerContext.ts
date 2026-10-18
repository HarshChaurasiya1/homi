import { createContext, useContext } from 'react'

export interface RouterContextType {
  path: string
  params: Record<string, string>
  navigate: (to: string) => void
}

export const RouterContext = createContext<RouterContextType>({
  path: '/',
  params: {},
  navigate: () => {},
})

export function useRouter() {
  return useContext(RouterContext)
}
