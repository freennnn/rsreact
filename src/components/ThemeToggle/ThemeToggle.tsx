import { useContext } from 'react'

import { ThemeContext } from '../../state/themeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext)
  return (
    <div className='theme-toggle'>
      <label className='switch'>
        <input
          type='checkbox'
          checked={theme === 'dark'}
          onChange={toggleTheme}
          className='toogle-input'
        />
        <span className='slider'></span>
      </label>
      <span className='theme-toggle__title'>{theme === 'dark' ? 'Dark Theme' : 'Light Theme'}</span>
    </div>
  )
}
