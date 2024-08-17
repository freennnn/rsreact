import { Link } from 'react-router-dom'

import { useAppSelector } from '../../data/store'
import {
  /*addUser, selectLastAddedUserId,*/
  selectUsers,
} from '../../data/usersSlice'
import './UsersPage.css'

export default function UsersPage() {
  const users = useAppSelector(selectUsers)
  //const lastUserId = useAppSelector(selectLastAddedUserId)

  return (
    <div className='gallery-page'>
      <p>Users Page</p>
      <Link to='/registrationHookForm'>Add user with React Hook Form</Link>
      <Link to='/registrationUncontrolledForm'>Add user with uncontrolled Form</Link>
      <div className='cards-and-details'>
        <div className='card-gallery'>
          {users ? (
            users.map((item) => <div>i am the user and my name is {item.name}</div>)
          ) : (
            <p>No users were created yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
