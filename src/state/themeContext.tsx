import React, { createContext, useState } from 'react'

const THEME_KEY = 'THEME_KEY'
const themeFromLS = localStorage.getItem(THEME_KEY) ? localStorage.getItem(THEME_KEY) : 'light'
const defaultValue = { theme: themeFromLS, toggleTheme: () => console.log('I am empty') }
const ThemeContext = createContext(defaultValue)

function ThemeContextProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState(themeFromLS)
  const toggleTheme = () => {
    setTheme((prevTheme) => {
      if (prevTheme === 'light') {
        localStorage.setItem(THEME_KEY, 'dark')
        return 'dark'
      }
      localStorage.setItem(THEME_KEY, 'light')
      return 'light'
    })
  }
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export { ThemeContextProvider, ThemeContext }
