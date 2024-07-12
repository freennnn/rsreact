import React from 'react'
import { Outlet } from 'react-router-dom'

import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary'
import { GalleryItem } from '../../components/GalleryItem/GalleryItem'
import { Loader } from '../../components/Loader/Loader'
import { Search } from '../../components/Search/Search'
import { getRepositores } from '../../services/api'
import { Log, LogError } from '../../utils/utils'
import './GalleryPage.css'

export interface Repository {
  id: number
  name: string
  description: string
  language: string
}

interface GalleryState {
  results: Array<Repository> | null
  searchTerm: string | null
  isLoading: boolean
}

export default class GalleryPage extends React.Component {
  state: GalleryState = {
    results: null,
    searchTerm: localStorage.getItem('SavedSearchTerm'),
    isLoading: false,
  }

  fetchRepositories = (searchTerm: string) => {
    localStorage.setItem('SavedSearchTerm', searchTerm)
    this.setState({ ...this.state, isLoading: true, searchTerm: searchTerm })
    getRepositores(searchTerm)
      .then((results) => {
        Log(results)
        this.setState({
          ...this.state,
          results: results.items as Array<Repository>,
          isLoading: false,
        })
      })
      .catch((e) => {
        LogError(e)
        this.setState({
          ...this.state,
          isLoading: false,
        })
      })

    //finally block won't work here - since state will be updated in async .then() call
    // and updating it here in finally will use stale/old state and reset our changes
    //.finally(() => this.setState({...this.state, isLoading:false}))
  }

  // using arrow syntax here (instead of method shorthand) to avoid explicit binding in the constructor
  onSearchButtonClick = (searchTerm: string) => {
    Log(`onSearchButton click in ${this} with new search Term: ${searchTerm}`)
    this.fetchRepositories(searchTerm)
  }

  componentDidMount(): void {
    this.fetchRepositories(this.state.searchTerm ? this.state.searchTerm : '')
  }

  render() {
    Log(`rendering:`)
    this.state.results?.forEach((item) => Log(item.name + item.language))
    if (this.state.isLoading) {
      return <Loader></Loader>
    } else {
      return (
        <ErrorBoundary>
          <div className='GalleryView'>
            <Search
              searchTerm={this.state.searchTerm ? this.state.searchTerm : undefined}
              onSearchButtonClick={this.onSearchButtonClick}
            ></Search>
            <div className='cards__lower-block'>
              <div className='card-gallery'>
                {this.state.results ? (
                  this.state.results.map((item) => (
                    <GalleryItem
                      id={item.id}
                      name={item.name}
                      description={item.description}
                      language={item.language}
                      key={item.id}
                    ></GalleryItem>
                  ))
                ) : (
                  <p>Gallery have no repositories loaded</p>
                )}
              </div>
              <Outlet></Outlet>
            </div>
          </div>
        </ErrorBoundary>
      )
    }
  }
}
