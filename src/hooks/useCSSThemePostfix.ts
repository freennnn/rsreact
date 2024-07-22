import { useContext } from 'react'

import clsx from 'clsx'

import { ThemeContext } from '../state/themeContext'

export const useCSSThemePostfix = () => {
  const { theme } = useContext(ThemeContext)
  const classNames = (className: string) => {
    // light theme is default and has no prefix in css; dark corresponds to '.className .dark' css and so on
    if (theme === 'ligth') return className
    return clsx(className, theme)
  }
  return { classNames }
}
