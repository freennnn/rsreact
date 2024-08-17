import { Link } from 'react-router-dom'

import './UsersPage.css'

export default function UsersPage() {
  return (
    <div>
      <p>Users Page</p>
      <Link to='/registrationHookForm'>Add user with React Hook Form</Link>
      <Link to='/registrationUncontrolledForm'>Add user with uncontrolled Form</Link>
    </div>
  )
}
