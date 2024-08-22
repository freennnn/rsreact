import { User } from '../data/types'
import './Card.css'

export function Card({ user, wasAddedLast }: { user: User; wasAddedLast: boolean }) {
  return (
    <div className={`card ${wasAddedLast ? 'last' : ''}`}>
      <div className='avatar'>
        <img src={user.avatarImage} alt={user.name} />
      </div>
      <p>
        <span>Name: </span>
        {user.name}
      </p>
      <p>
        <span>Age: </span>
        {user.age}
      </p>
      <p>
        <span>Email: </span>
        {user.email}
      </p>
    </div>
  )
}
