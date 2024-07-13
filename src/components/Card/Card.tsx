import { Repository } from '../../pages/GalleryPage/GalleryPage'
import './Card.css'

interface CardProps extends Repository {}

export function Card(props: CardProps) {
  return (
    <div className='card'>
      <p>{props.name}</p>
      <p>{props.description}</p>
      <p>{props.language}</p>
    </div>
  )
}
