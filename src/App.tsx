import { Route, Routes } from 'react-router-dom'

import './App.css'
import GalleryPage from './pages/GalleryPage/GalleryPage'
import NotFoundPage from './pages/NotFoundPage/NotFoundPage'
import CardDetails from './views/CardDetails/CardDetails.tsx'

function App() {
  return (
    <div className='container'>
      <Routes>
        <Route path='/' element={<GalleryPage />}>
          <Route path='/detail/:id' element={<CardDetails></CardDetails>} />
        </Route>
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </div>
  )
}

export default App
