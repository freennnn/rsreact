import { Route, Routes } from 'react-router-dom'

import { setUseWhatChange } from '@simbathesailor/use-what-changed'

import './App.css'
import GalleryPage from './pages/GalleryPage/GalleryPage'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'
import CardDetails from './views/CardDetails/CardDetails.tsx'

setUseWhatChange(process.env.NODE_ENV === 'development')

export function App() {
  return (
    <div className='container'>
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
