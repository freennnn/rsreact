import { useEffect } from 'react'

import { setCookie } from 'cookies-next'
import { ThemeProvider, useTheme } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes/dist/types'

function AppThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <ThemeProvider enableColorScheme attribute='class' {...props}>
      <AppThemeProviderHelper />
      {children}
    </ThemeProvider>
  )
}

function AppThemeProviderHelper() {
  const { theme } = useTheme()

  useEffect(() => {
    setCookie('__theme__', theme, {
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
      path: '/',
    })
  }, [theme])
  return null
}

export default AppThemeProvider
