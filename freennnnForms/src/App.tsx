import { Route, Routes } from 'react-router-dom'

import './App.css'
import NotFoundPage from './pages/NotFound/NotFoundPage'
import UserRegistrationHookFormPage from './pages/UserRegistrationHookForm/UserRegistrationHookFormPage'
import UserRegistrationUncontrolledFormPage from './pages/UserRegistrationUncontrolled/UserRegistrationUncontrolledPage'
import UsersPage from './pages/Users/UsersPage'

function App() {
  return (
    <div className='window-background'>
      <div className='container'>
        <Routes>
          <Route path='/registrationHookForm' element={<UserRegistrationHookFormPage />} />
          <Route
            path='/registrationUncontrolledForm'
            element={<UserRegistrationUncontrolledFormPage />}
          />
          <Route path='/' element={<UsersPage />} />

          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
