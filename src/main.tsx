import React from 'react'
import { BrowserRouter } from 'react-router-dom'

import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import './index.css'
import { ThemeContextProvider } from './state/themeContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeContextProvider>
  </React.StrictMode>,
)
