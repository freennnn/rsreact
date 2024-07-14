import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'

import { Card } from '../../components/Card/Card'
import { ErrorBoundary } from '../../components/ErrorBoundary/ErrorBoundary'
import { Loader } from '../../components/Loader/Loader'
import { Pagination } from '../../components/Pagination/Pagination'
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
  const [totalRepoCount, setTotalRepoCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const { searchTerm, setSearchTerm } = useSyncSearchTermWithLocalStorage()
  const [currentPage, setCurrentPage] = useState(1)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchRepositories = async (searchTerm: string, page: number) => {
      setIsLoading(true)

      try {
        const results = await getRepositores(searchTerm, page)
        Log(results)
        setRepositories(results.items as Array<Repository>)
        setTotalRepoCount(results.total_count as number)
      } catch (e) {
        LogError(e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRepositories(searchTerm ? searchTerm : '', currentPage)
  }, [searchTerm, currentPage])

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

  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage)
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
              <Pagination
                currentPage={currentPage}
                numberOfPages={totalRepoCount / 5}
                onPageChange={onPageChange}
              ></Pagination>
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
