import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary'
import { GalleryItem } from '../../components/GalleryItem/GalleryItem'
import { Loader } from '../../components/Loader/Loader'
import { Search } from '../../components/Search/Search'
import { useSyncSearchTermWithLocalStorage } from '../../hooks/useSyncSearchTermWithLocalStorage'
import { getRepositores } from '../../services/api'
import { Log, LogError } from '../../utils/utils'
import './GalleryPage.css'

export interface Repository {
  id: number
  name: string
  description: string
  language: string
}

export default function GalleryPage() {
  const [repositories, setRepositories] = useState<Repository[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { searchTerm, setSearchTerm } = useSyncSearchTermWithLocalStorage()

  useEffect(() => {
    const fetchRepositories = async (searchTerm: string) => {
      setIsLoading(true)
      //setSearchTerm(searchTerm)

      try {
        const results = await getRepositores(searchTerm)
        Log(results)
        setRepositories(results.items as Array<Repository>)
      } catch (e) {
        LogError(e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRepositories(searchTerm ? searchTerm : '')
  }, [searchTerm /*, setSearchTerm*/])

  const onSearchButtonClick = (newSearchTerm: string) => {
    Log(`onSearchButton click in GalleryPage with new search Term: ${newSearchTerm}`)
    setSearchTerm(newSearchTerm)
  }
  Log(`rendering:`)
  repositories?.forEach((item) => Log(item.name + item.language))

  if (isLoading) {
    return <Loader></Loader>
  } else {
    return (
      <ErrorBoundary>
        <div className='GalleryView'>
          <Search
            searchTerm={searchTerm ? searchTerm : undefined}
            onSearchButtonClick={onSearchButtonClick}
          ></Search>
          <div className='cards__lower-block'>
            <div className='card-gallery'>
              {repositories ? (
                repositories.map((item) => (
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
