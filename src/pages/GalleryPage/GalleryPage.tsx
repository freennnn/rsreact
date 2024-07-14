import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { Card } from '../../components/Card/Card'
import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary'
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
  stargazers_count: number
  forks_count: number
  updated_at: string
  contributors_url: string
  owner: {
    login: string
    avatar_url: string
    type: string
  }
}

export default function GalleryPage() {
  const [repositories, setRepositories] = useState<Repository[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { searchTerm, setSearchTerm } = useSyncSearchTermWithLocalStorage()

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchRepositories = async (searchTerm: string) => {
      setIsLoading(true)

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
  }, [searchTerm])

  const onSearchButtonClick = (newSearchTerm: string) => {
    Log(`onSearchButton click in GalleryPage with new search Term: ${newSearchTerm}`)
    setSearchTerm(newSearchTerm)
  }

  const onCardClick = (owner: string, name: string) => {
    Log(`onCardClick`)
    navigate(`/repo/${owner}/${name}`)
  }

  const onMainBlockClick = () => {
    console.log('-- card gallery block clicked ---')

    if (location.pathname.includes('/repo')) {
      navigate('/')
    }
  }

  Log(`GalleryPage rendering:`)
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
          <div className='cards__lower-block' onClick={onMainBlockClick}>
            <div className='card-gallery'>
              {repositories ? (
                repositories.map((item) => (
                  <Card repository={item} key={item.id} onClick={onCardClick}></Card>
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
