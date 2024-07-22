import { useCallback, useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

//import { useWhatChanged } from '@simbathesailor/use-what-changed'
import { Card } from '../../components/Card/Card'
import { ErrorBoundaryWithCSSThemePostfixHook } from '../../components/ErrorBoundary/ErrorBoundaryWithCSSThemePostfixHook'
import { Loader } from '../../components/Loader/Loader'
import { Pagination } from '../../components/Pagination/Pagination'
import { Search } from '../../components/Search/Search'
import { ThemeToggle } from '../../components/ThemeToggle/ThemeToggle'
import { useCSSThemePostfix } from '../../hooks/useCSSThemePostfix'
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
  // React Router hooks:
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const { classNames } = useCSSThemePostfix()

  // Third party library hook to debug/optimize how many times and why useEffect() hook has been called
  //useWhatChanged([searchTerm, currentPage], 'searchTerm', 'currentPage') // debugs the below useEffect

  useEffect(() => {
    Log('GalleryPage, fetchRepositories useEffect triggered')
    const fetchRepositories = async (searchTerm: string, page: number) => {
      //Log('--- fetchRepositories called ---')
      setIsLoading(true)
      setSearchParams(`search=${searchTerm}&page=${page}`)
      try {
        //Log('-- getRepositores called and awaited --')
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
    // adding setSearchParams function to dependecy list leads to useEffect() double
    // firing. That's because setSearchParams() function is not `stable`; it's considered
    // a known bug of React Router: https://github.com/remix-run/react-router/issues/9991
    // eslint-disable-next-line
  }, [searchTerm, currentPage])

  const onSearchButtonClick = useCallback(
    (newSearchTerm: string) => {
      Log(`onSearchButton click in GalleryPage with new search Term: ${newSearchTerm}`)
      setSearchTerm(newSearchTerm)
      setCurrentPage(1)
    },
    [setSearchTerm],
  )

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
    <ErrorBoundaryWithCSSThemePostfixHook>
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
    </ErrorBoundaryWithCSSThemePostfixHook>
  )
}
