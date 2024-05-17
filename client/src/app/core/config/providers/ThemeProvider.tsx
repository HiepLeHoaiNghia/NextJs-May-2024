import { useEffect } from 'react'
import { useRecoilValue } from 'recoil'

import themeState from '~/core/config/recoil/theme'
import { THEME } from '~/core/constants'

interface ThemeProviderProps {
  children: React.ReactNode
}

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const theme = useRecoilValue(themeState)

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove(THEME.LIGHT, THEME.DARK)

    if (theme === THEME.SYSTEM) {
      const systemTheme = window.matchMedia(`(prefers-color-scheme: ${THEME.DARK})`).matches ? THEME.DARK : THEME.LIGHT

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  return children
}

export default ThemeProvider
