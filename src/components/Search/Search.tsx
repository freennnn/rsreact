import React from 'react'
import './Search.css'
import { ErrorButton } from '../ErrorButton/ErrorButton'

interface SearchProps {
  searchTerm?: string,
  onSearchButtonClick(searchTerm: string): void
}

export class Search extends React.Component<SearchProps> {
  // we'll implement controlled style input, event though technically
  // `const inputRef = useRef();` would suffice
  state = { searchTerm: this.props.searchTerm ? this.props.searchTerm : ""}

  onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //`we can implement auto search, with cancelling previous FetchRequest
    // Promises in future`
    console.log(`onSearchInputChange ${e.target.value}`)
    this.setState({searchTerm: e.target.value})
  }

  onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log(this.state.searchTerm)
    this.props.onSearchButtonClick(this.state.searchTerm)
  }

  render() {
    console.log('rerender')
    return (
        <form onSubmit={this.onSubmit} className='search-form'>
          <input
            type='text'
            placeholder='Search..'
            className='searchbar'
            onChange={this.onSearchInputChange}
            value={this.state.searchTerm}
          >
          </input>
          <button
            type='submit'
            className='search-button'
          >
            Search
          </button>
          <ErrorButton>
            Generate Error
          </ErrorButton>
        </form>
    )
  }
}

