import React, { useState } from 'react'

import { useCssClassWithTheme } from '../../hooks/useCssClassWithTheme'
import { Log } from '../../utils/utils'
import styles from './Search.module.css'

interface SearchProps {
  searchTerm?: string
  onSearchButtonClick(searchTerm: string): void
}

export function Search(props: SearchProps) {
  const { classNames } = useCssClassWithTheme()

  // we'll implement 'controlled style' input, event though technically
  // `const inputRef = useRef();` would suffice here
  const [enteredSearchTerm, setEnteredSearchTerm] = useState(
    props.searchTerm ? props.searchTerm : '',
  )

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //Log(`onSearchInputChange ${e.target.value}`)
    setEnteredSearchTerm(e.target.value)
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    Log(enteredSearchTerm)
    props.onSearchButtonClick(enteredSearchTerm)
  }

  return (
    <form onSubmit={onSubmit} className={styles['search-form']}>
      <input
        type='text'
        placeholder='Search..'
        className={styles.searchbar}
        onChange={onSearchInputChange}
        value={enteredSearchTerm}
      ></input>
      <button type='submit' className={styles['search-button'] + ' ' + classNames('search-button')}>
        Search
      </button>
    </form>
  )
}
