import { Repository } from '../../pages/GalleryPage/GalleryPage'
import './Card.css'

interface CardProps {
  repository: Repository
  onClick: (owner: string, name: string) => void
}

export function Card(props: CardProps) {
  return (
    <div
      className='card'
      onClick={(e: React.MouseEvent) => {
        console.log('-- card clicked ---')
        e.stopPropagation()
        props.onClick(props.repository.owner.login, props.repository.name)
      }}
    >
      <p>{props.repository.name}</p>
      <p>{props.repository.description}</p>
      <p>{props.repository.language}</p>
    </div>
  )
}
