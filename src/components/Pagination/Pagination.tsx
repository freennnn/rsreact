import { useState } from 'react'

import './Pagination.css'

interface PaginationProps {
  currentPage: number
  numberOfPages: number
  onPageChange: (newPage: number) => void
}

export function Pagination(props: PaginationProps) {
  const [currentPage, setCurrentPage] = useState(props.currentPage)

  const leftPageExist = () => {
    if (currentPage > 1) {
      return true
    }
    return false
  }
  const rightPageExist = () => {
    if (currentPage < props.numberOfPages) {
      return true
    }
    return false
  }

  const leftClicked = () => {
    setCurrentPage(currentPage - 1)
    props.onPageChange(currentPage - 1)
  }

  const rightClicked = () => {
    setCurrentPage(currentPage + 1)
    props.onPageChange(currentPage + 1)
  }

  return (
    <div className='pagination' onClick={(e) => e.stopPropagation()}>
      <button className='pagination__button' disabled={!leftPageExist()} onClick={leftClicked}>
        {'<'}
      </button>
      <button className='pagination__button' disabled={true}>
        {currentPage}
      </button>
      <button className='pagination__button' disabled={!rightPageExist()} onClick={rightClicked}>
        {'>'}
      </button>
    </div>
  )
}
