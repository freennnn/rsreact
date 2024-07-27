import { useCSSThemeClass } from '../../hooks/useCSSThemeClass'
import { Repository } from '../../services/types'
import './Card.css'

interface CardProps {
  repository: Repository
  selected: boolean
  onClick: (owner: string, name: string) => void
  onSelectToggle: (wasSelected: boolean, repository: Repository) => void
}

export function Card(props: CardProps) {
  const { classNames } = useCSSThemeClass()
  return (
    <div
      className={classNames('card')}
      onClick={(e: React.MouseEvent) => {
        console.log('-- card clicked ---')
        e.stopPropagation()
        props.onClick(props.repository.owner.login, props.repository.name)
      }}
    >
      <label className='card__checkbox-label'>
        <input
          type='checkbox'
          checked={props.selected}
          onChange={(e: React.ChangeEvent) => {
            console.log('checkbox on change')
            e.stopPropagation()
            props.onSelectToggle(props.selected, props.repository)
          }}
          // stop propgataion 'click' event to prevent Card gallery item from clicking
          onClick={(e) => e.stopPropagation()}
          className='card__checkbox'
        />
        <span className='card__checkbox-slider'></span>
      </label>
      <p>{props.repository.name}</p>
      <p>{props.repository.description}</p>
      <p>{props.repository.language}</p>
    </div>
  )
}
