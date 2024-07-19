import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

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
  const [searchParams, setSearchParams] = useSearchParams()

  useEffect(() => {
    Log('GalleryPage, fetchRepositories useEffect triggered')
    const fetchRepositories = async (searchTerm: string, page: number) => {
      setIsLoading(true)
      setSearchParams(`search=${searchTerm}&page=${page}`)
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
  }, [searchTerm, currentPage, setSearchParams])

  const onSearchButtonClick = (newSearchTerm: string) => {
    Log(`onSearchButton click in GalleryPage with new search Term: ${newSearchTerm}`)
    setSearchTerm(newSearchTerm)
  }

  const onCardClick = (owner: string, name: string) => {
    Log(`onCardClick`)
    navigate(`/repo/${owner}/${name}`)
  }

  const onCardGalleryClick = () => {
    console.log('-- card gallery clicked ---')

    if (location.pathname.includes('/repo')) {
      navigate(`/?${searchParams}`)
    }
  }

  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  Log(`GalleryPage render`)
  // repositories?.forEach((item) => Log(item.name + item.language))

  return (
    <ErrorBoundary>
      <div className='gallery-page'>
        <Search
          searchTerm={searchTerm ? searchTerm : undefined}
          onSearchButtonClick={onSearchButtonClick}
        ></Search>
        <div className='cards-and-details'>
          <div className='card-gallery' onClick={onCardGalleryClick}>
            <Pagination
              currentPage={currentPage}
              numberOfPages={totalRepoCount / 5}
              onPageChange={onPageChange}
            ></Pagination>
            {isLoading ? (
              <Loader></Loader>
            ) : repositories ? (
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
