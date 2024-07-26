import { useCSSThemeClass } from '../../hooks/useCSSThemeClass'
import './FlyOut.css'

interface FlyOutProps {
  numberOfItems: number
  onUnselectAllClick: () => void
  onDownloadClick: () => void
}

export function FlyOut(props: FlyOutProps) {
  const { classNames } = useCSSThemeClass()
  return (
    <div className={classNames('flyout')}>
      <p className={classNames('flyout__text')}>
        {props.numberOfItems} items {props.numberOfItems > 1 ? 'are' : 'is'} selected
      </p>
      <button className={classNames('flyout__button')} onClick={props.onUnselectAllClick}>
        Unselect all
      </button>
      <button className={classNames('flyout__button')} onClick={props.onDownloadClick}>
        Download all
      </button>
    </div>
  )
}
