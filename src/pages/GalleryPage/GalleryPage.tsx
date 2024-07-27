import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom'

//import { useWhatChanged } from '@simbathesailor/use-what-changed'
import { Card } from '../../components/Card/Card'
import { ErrorBoundaryWithCSSThemeClassHook } from '../../components/ErrorBoundary/ErrorBoundaryWithCSSThemeClassHook'
import { FlyOut } from '../../components/FlyOut/FlyOut'
import { Loader } from '../../components/Loader/Loader'
import { Pagination } from '../../components/Pagination/Pagination'
import { Search } from '../../components/Search/Search'
import { ThemeToggle } from '../../components/ThemeToggle/ThemeToggle'
import { useCSSThemeClass } from '../../hooks/useCSSThemeClass'
import { useSyncSearchTermWithLocalStorage } from '../../hooks/useSyncSearchTermWithLocalStorage'
import { githubApi } from '../../services/githubApi'
import { Repository } from '../../services/types'
import { Log, LogError } from '../../utils/utils'
import './GalleryPage.css'
import { selectPageNumber, setPage } from './pageNumberSlice'
import {
  addRepository,
  removeAllRepositories,
  removeRepository,
  selectSelectedIds,
  selectSelectedRepositores,
} from './selectedItemsSlice'

export default function GalleryPage() {
  const { searchTerm, setSearchTerm } = useSyncSearchTermWithLocalStorage()
  //const [currentPage, setCurrentPage] = useState(1)
  // React Router hooks:
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  // Redux toolkit state
  const currentPage = useSelector(selectPageNumber)
  const selectedCardIds = useSelector(selectSelectedIds)
  const selectedRepositores = useSelector(selectSelectedRepositores)

  const dispatch = useDispatch()
  // RTK query api data
  const { data, error, isLoading, isFetching } = githubApi.useGetRepositoriesQuery({
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
    dispatch(setPage(1))
    //setCurrentPage(1)
    //setSearchParams(`search=${newSearchTerm}&page=${currentPage}`)
  }

  const onCardClick = (owner: string, name: string) => {
    Log(`onCardClick`)
    navigate(`/repo/${owner}/${name}/?${searchParams}`)
  }

  const onSelectCardToggle = (wasSelected: boolean, repository: Repository) => {
    Log(`onSelectCardToggle`)
    if (wasSelected) {
      dispatch(removeRepository(repository))
    } else {
      dispatch(addRepository(repository))
    }
  }

  const onCardGalleryClick = () => {
    console.log('-- card gallery clicked ---')

    if (location.pathname.includes('/repo')) {
      navigate(`/?${searchParams}`)
    }
  }

  const onPageChange = (newPage: number) => {
    dispatch(setPage(newPage))
    //setCurrentPage(newPage)
    //setSearchParams(`search=${searchTerm}&page=${newPage}`)
  }

  // FlyOut callbacks
  const onUnselectAllInFlyoutClick = () => {
    dispatch(removeAllRepositories())
  }

  const onDownloadInFlyoutClick = () => {
    //Log(selectedRepositores)
    const csvReposData = selectedRepositores.map((item) => [
      item.name,
      item.owner.login,
      item.stargazers_count,
      item.description,
    ])
    const formattedData = [['name', 'owner', 'stars', 'description'], ...csvReposData]
    let csvString = ''
    formattedData.forEach((row) => {
      csvString += row.join(',') + '\n'
    })
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8,' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${selectedRepositores.length}_repositories.csv`
    link.click()

    Log('downloading repos to csv')
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
            {isLoading || isFetching ? (
              <Loader></Loader>
            ) : data ? (
              data.items.map((item) => (
                <Card
                  repository={item}
                  key={item.id}
                  selected={selectedCardIds.includes(item.id)}
                  onClick={onCardClick}
                  onSelectToggle={onSelectCardToggle}
                ></Card>
              ))
            ) : (
              <p>Gallery have no repositories loaded</p>
            )}
          </div>
          <Outlet></Outlet>
        </div>
        {selectedCardIds.length > 0 && (
          <FlyOut
            numberOfItems={selectedCardIds.length}
            onDownloadClick={onDownloadInFlyoutClick}
            onUnselectAllClick={onUnselectAllInFlyoutClick}
          ></FlyOut>
        )}
      </div>
    </ErrorBoundaryWithCSSThemeClassHook>
  )
}
