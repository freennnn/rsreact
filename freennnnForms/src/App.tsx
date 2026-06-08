import { Route, Routes } from 'react-router-dom'

import './App.css'
import NotFoundPage from './pages/NotFound/NotFoundPage'
import UsersPage from './pages/Users/UsersPage'

function App() {
  return (
    <div className='window-background'>
      <div className='container'>
        <Routes>
          <Route path='/' element={<UsersPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
