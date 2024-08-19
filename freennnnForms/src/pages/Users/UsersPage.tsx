import { Link } from 'react-router-dom'

import { Card } from '../../components/Card'
import { useAppSelector } from '../../data/store'
import { selectLastAddedUserId, selectUsers } from '../../data/usersSlice'
import './UsersPage.css'

export default function UsersPage() {
  const users = useAppSelector(selectUsers)
  const lastAddedUserId = useAppSelector(selectLastAddedUserId)
  //const lastUserId = useAppSelector(selectLastAddedUserId)

  return (
    <div className='gallery-page'>
      <p>Users Page</p>
      <Link to='/registrationHookForm'>Add user with React Hook Form</Link>
      <Link to='/registrationUncontrolledForm'>Add user with uncontrolled Form</Link>
      <div className='cards-and-details'>
        <div className='card-gallery'>
          {users ? (
            users.map((item) => (
              <Card user={item} wasAddedLast={lastAddedUserId === item.id}></Card>
            ))
          ) : (
            <p>No users were created yet</p>
          )}
        </div>
      </div>
    </div>
  )
}
