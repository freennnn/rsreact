import clsx from 'clsx'
import { useTheme } from 'next-themes'

export const useCssClassWithTheme = () => {
  const { theme } = useTheme()
  const classNames = (className: string) => {
    // light theme is default and has no prefix in css; dark corresponds to '.className .dark' css and so on
    if (theme === 'ligth') return className
    return clsx(className, theme)
  }
  return { classNames }
}
