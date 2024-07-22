import { useCSSThemePostfix } from '../../hooks/useCSSThemePostfix'
import { Repository } from '../../pages/GalleryPage/GalleryPage'
import './Card.css'

interface CardProps {
  repository: Repository
  onClick: (owner: string, name: string) => void
}

export function Card(props: CardProps) {
  const { classNames } = useCSSThemePostfix()
  return (
    <div
      className={classNames('card')}
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
