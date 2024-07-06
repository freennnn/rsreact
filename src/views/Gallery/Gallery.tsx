import React from 'react'
import { getRepositores } from '../../services/api'
import { GalleryItem } from '../../components/GalleryItem/GalleryItem'
import './Gallery.css'
import { Search } from '../../components/Search/Search'

export interface Repository {
  id: number,
  name: string,
  description: string,
  language: string
}

interface GalleryState {
  results: Array<Repository> | null,
  searchTerm: string | null
}

export class Gallery extends React.Component {

  state: GalleryState = {
    results: null,
    searchTerm: localStorage.getItem('SavedSearchTerm')
  }

  fetchRepositories = (searchTerm?: string) => {
    getRepositores(searchTerm)
    .then(results => {
      console.log(results)
      this.setState({...this.state, results: results.items as Array<Repository>})
    })
    .catch(e => console.error(e))
  }

  // using arrow syntax here (instead of method shorthand) to avoid explicit binding in the constructor
  onSearchButtonClick = (searchTerm: string) => {
    console.log(`onSearchButton click in ${this} with new search Term: ${searchTerm}`)
    localStorage.setItem('SavedSearchTerm',searchTerm)
    this.setState({...this.state, searchTerm: searchTerm})
    this.fetchRepositories(searchTerm)
  }
  
  componentDidMount(): void {
    this.fetchRepositories(this.state.searchTerm ? this.state.searchTerm : undefined)
  }

  render() {
    console.log(`rendering:`)
    this.state.results?.forEach((item) => console.log(item.name + item.language))
    return (
      <div className='GalleryView'>
        <Search
          searchTerm={this.state.searchTerm ? this.state.searchTerm : undefined}
          onSearchButtonClick={this.onSearchButtonClick}
        >
        </Search>
        { this.state.results?
          this.state.results.map(item =>
            <GalleryItem
              id = {item.id}
              name={item.name}
              description={item.description}
              language={item.language}
              key={item.id}>
           </GalleryItem>
          )
          :
          <p>Gallery have no repositories loaded</p>
        }
      </div>  
    )
  }
}