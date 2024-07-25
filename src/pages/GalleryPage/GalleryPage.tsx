import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

//import { useWhatChanged } from '@simbathesailor/use-what-changed'
import { Card } from '../../components/Card/Card'
import { ErrorBoundaryWithCSSThemeClassHook } from '../../components/ErrorBoundary/ErrorBoundaryWithCSSThemeClassHook'
import { Loader } from '../../components/Loader/Loader'
import { Pagination } from '../../components/Pagination/Pagination'
import { Search } from '../../components/Search/Search'
import { ThemeToggle } from '../../components/ThemeToggle/ThemeToggle'
import { useCSSThemeClass } from '../../hooks/useCSSThemeClass'
import { useSyncSearchTermWithLocalStorage } from '../../hooks/useSyncSearchTermWithLocalStorage'
import { githubApi } from '../../services/githubApi'
import { Log, LogError } from '../../utils/utils'
import './GalleryPage.css'

export default function GalleryPage() {
  const { searchTerm, setSearchTerm } = useSyncSearchTermWithLocalStorage()
  const [currentPage, setCurrentPage] = useState(1)
  // React Router hooks:
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  // RTK api data
  const { data, error, isLoading } = githubApi.useGetRepositoriesQuery({
    searchTerm,
    pageNumber: currentPage,
  })

  const { classNames } = useCSSThemeClass()

  useEffect(() => {
    setSearchParams(`search=${searchTerm}&page=${currentPage}`)
  }, [currentPage, searchTerm, setSearchParams])

  const onSearchButtonClick = (newSearchTerm: string) => {
    Log(`onSearchButton click in GalleryPage with new search Term: ${newSearchTerm}`)
    setSearchTerm(newSearchTerm)
    setCurrentPage(1)
    //setSearchParams(`search=${newSearchTerm}&page=${currentPage}`)
  }

  const onCardClick = (owner: string, name: string) => {
    Log(`onCardClick`)
    navigate(`/repo/${owner}/${name}/?${searchParams}`)
  }

  const onCardGalleryClick = () => {
    console.log('-- card gallery clicked ---')

    if (location.pathname.includes('/repo')) {
      navigate(`/?${searchParams}`)
    }
  }

  const onPageChange = (newPage: number) => {
    setCurrentPage(newPage)
    //setSearchParams(`search=${searchTerm}&page=${newPage}`)
  }

  Log(`GalleryPage render`)
  if (error) {
    LogError(error)
  }

  return (
    <ErrorBoundaryWithCSSThemeClassHook>
      <div className={classNames('gallery-page')}>
        <ThemeToggle></ThemeToggle>
        <Search
          searchTerm={searchTerm ? searchTerm : undefined}
          onSearchButtonClick={onSearchButtonClick}
        ></Search>
        <div className='cards-and-details'>
          <div className={classNames('card-gallery')} onClick={onCardGalleryClick}>
            <Pagination
              currentPage={currentPage}
              numberOfPages={data ? data.total_count / 5 : 1}
              onPageChange={onPageChange}
            ></Pagination>
            {isLoading ? (
              <Loader></Loader>
            ) : data ? (
              data.items.map((item) => (
                <Card repository={item} key={item.id} onClick={onCardClick}></Card>
              ))
            ) : (
              <p>Gallery have no repositories loaded</p>
            )}
          </div>
          <Outlet></Outlet>
        </div>
      </div>
    </ErrorBoundaryWithCSSThemeClassHook>
  )
}
