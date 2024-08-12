import { useCssClassWithTheme } from '../../hooks/useCssClassWithTheme'
import styles from './FlyOut.module.css'

interface FlyOutProps {
  numberOfItems: number
  onUnselectAllClick: () => void
  onDownloadClick: () => void
}

export function FlyOut(props: FlyOutProps) {
  const { classNames } = useCssClassWithTheme()
  return (
    <div className={classNames('flyout') + ' ' + styles.flyout}>
      <p className={styles['flyout__text']}>
        {props.numberOfItems} items {props.numberOfItems > 1 ? 'are' : 'is'} selected
      </p>
      <button
        className={styles['flyout__button'] + ' ' + classNames('flyout__button')}
        onClick={props.onUnselectAllClick}
      >
        Unselect all
      </button>
      <button
        className={styles['flyout__button'] + ' ' + classNames('flyout__button')}
        onClick={props.onDownloadClick}
      >
        Download all
      </button>
    </div>
  )
}
