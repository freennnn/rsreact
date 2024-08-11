'use client'

import { useTheme } from 'next-themes'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light')
    } else {
      setTheme('dark')
    }
  }

  return (
    <div className='theme-toggle'>
      <label className='switch'>
        <input
          type='checkbox'
          checked={theme === 'dark'}
          onChange={toggleTheme}
          className='toggle-input'
        />
        <span className='slider'></span>
      </label>
      <span className='theme-toggle__title'>{theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</span>
    </div>
  )
}
