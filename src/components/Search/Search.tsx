import React, { useState } from 'react'

import { Log } from '../../utils/utils'
import { ErrorButton } from '../ErrorButton/ErrorButton'
import './Search.css'

interface SearchProps {
  searchTerm?: string
  onSearchButtonClick(searchTerm: string): void
}

export function Search(props: SearchProps) {
  // we'll implement 'controlled style' input, event though technically
  // `const inputRef = useRef();` would suffice here
  const [enteredSearchTerm, setEnteredSearchTerm] = useState(
    props.searchTerm ? props.searchTerm : '',
  )

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //`we can implement auto search, with cancelling previous FetchRequest
    // Promises in future`
    //Log(`onSearchInputChange ${e.target.value}`)
    setEnteredSearchTerm(e.target.value)
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    Log(enteredSearchTerm)
    props.onSearchButtonClick(enteredSearchTerm)
  }

  Log('Search re-render')
  return (
    <form onSubmit={onSubmit} className='search-form'>
      <input
        type='text'
        placeholder='Search..'
        className='searchbar'
        onChange={onSearchInputChange}
        value={enteredSearchTerm}
      ></input>
      <button type='submit' className='search-button'>
        Search
      </button>
      <ErrorButton>Generate Error</ErrorButton>
    </form>
  )
}
