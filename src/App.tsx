import { Route, Routes } from 'react-router-dom'

import { setUseWhatChange } from '@simbathesailor/use-what-changed'

import './App.css'
import { useCSSThemePostfix } from './hooks/useCSSThemePostfix.ts'
import GalleryPage from './pages/GalleryPage/GalleryPage'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'
import CardDetails from './views/CardDetails/CardDetails.tsx'

setUseWhatChange(process.env.NODE_ENV === 'development')

export function App() {
  const { classNames } = useCSSThemePostfix()

  return (
    <div className={classNames('container')}>
      <Routes>
        <Route path='/' element={<GalleryPage />}>
          <Route path='/repo/:owner/:name' element={<CardDetails></CardDetails>} />
        </Route>
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App
