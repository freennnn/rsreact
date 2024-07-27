import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import './index.css'
import { store } from './state/store'
import { ThemeContextProvider } from './state/themeContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeContextProvider>
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ThemeContextProvider>
  </React.StrictMode>,
)
