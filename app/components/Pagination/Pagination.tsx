import { useCssClassWithTheme } from '../../hooks/useCssClassWithTheme'
import styles from './Pagination.module.css'

interface PaginationProps {
  currentPage: number
  numberOfPages: number
  onPageChange: (newPage: number) => void
}

export function Pagination(props: PaginationProps) {
  const { classNames } = useCssClassWithTheme()
  const leftPageExist = () => {
    if (props.currentPage > 1) {
      return true
    }
    return false
  }
  const rightPageExist = () => {
    if (props.currentPage < props.numberOfPages) {
      return true
    }
    return false
  }

  const leftClicked = () => {
    props.onPageChange(Number(props.currentPage) - 1)
  }

  const rightClicked = () => {
    props.onPageChange(Number(props.currentPage) + 1)
  }

  return (
    <div className='pagination' onClick={(e) => e.stopPropagation()}>
      <button
        className={styles['pagination__button'] + ' ' + classNames('pagination__button')}
        disabled={!leftPageExist()}
        onClick={leftClicked}
      >
        {'<'}
      </button>
      <button
        className={styles['pagination__button'] + ' ' + classNames('pagination__button')}
        disabled={true}
      >
        {props.currentPage}
      </button>
      <button
        className={styles['pagination__button'] + ' ' + classNames('pagination__button')}
        disabled={!rightPageExist()}
        onClick={rightClicked}
      >
        {'>'}
      </button>
    </div>
  )
}
