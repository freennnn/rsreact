'use client'

import { useEffect, useState } from 'react'

import { useTheme } from 'next-themes'
import { ReadonlyURLSearchParams, useRouter, useSearchParams } from 'next/navigation'
import { useLocalStorage } from 'usehooks-ts'

import { RepositoriesSearchResult, Repository } from '../../data/types'
import { useCssClassWithTheme } from '../../hooks/useCssClassWithTheme'
import { Log } from '../../utils/utils'
import { Card } from '../Card/Card'
import CardDetails from '../CardDetails/CardDetails'
import { FlyOut } from '../FlyOut/FlyOut'
import { Loader } from '../Loader/Loader'
import { Pagination } from '../Pagination/Pagination'
import { Search } from '../Search/Search'
import { ThemeToggle } from '../ThemeToggle/ThemeToggle'

export default function GalleryView({
  repoSearch,
  repoDetails,
}: {
  repoSearch: RepositoriesSearchResult
  repoDetails: Repository | undefined
}) {
  const [isLoading, setIsLoading] = useState(false)

  const { theme } = useTheme()
  const { classNames } = useCssClassWithTheme()
  const router = useRouter()
  const searchParams = useSearchParams() as ReadonlyURLSearchParams
  const searchTerm = searchParams.get('search') as string | undefined
  const currentPageNumber = searchParams.get('page') as unknown as number | undefined

  const initialValue: Array<Repository> = []
  const [selectedRepos, setSelectedRepos] = useLocalStorage('SELECTED_REPOS', initialValue, {
    initializeWithValue: false,
  })
  const [selectedReposIds, setSelectedReposIds] = useState<Array<number>>([])
  const onSelectCardToggle = (wasSelected: boolean, repository: Repository) => {
    if (!wasSelected) {
      const newSelectedRepos = [...selectedRepos, repository]
      setSelectedRepos(newSelectedRepos)
      setSelectedReposIds([...selectedReposIds, repository.id])
    } else {
      const newSelectedRepos = selectedRepos.filter((item) => item.id !== repository.id)
      setSelectedRepos(newSelectedRepos)
      setSelectedReposIds(selectedReposIds.filter((item) => item !== repository.id))
    }
  }
  const onCardGalleryClick = () => {
    //check if we have Details section opened (owner and name search params should be in URL)
    const owner = searchParams.get('owner') as string | undefined
    if (owner) {
      const newUrl = `/?search=${searchTerm ? searchTerm : ''}&page=${currentPageNumber ? currentPageNumber : 1}`
      router.replace(newUrl)
      // alternatively to avoid data re-fetching we could have used manual approach here:
      // repoDetails = undefined
      // router.replace(newUrl, newUrl, {shallow: true})
    }
  }

  const onCardClick = (owner: string, name: string) => {
    router.replace(
      `/?search=${searchTerm ? searchTerm : ''}&page=${currentPageNumber ? currentPageNumber : 1}&owner=${owner}&name=${name}`,
    )
  }

  const onSearchButtonClick = (newSearchTerm: string) => {
    router.replace(`/?search=${newSearchTerm}&page=${1}`) //router.asPath
    setIsLoading(true)
  }

  const onPageChange = (newPage: number) => {
    const owner = searchParams.get('owner') as string | undefined
    const name = searchParams.get('name') as string | undefined
    const repoDetailsOwnerPart = `${owner ? `&owner=${owner}` : ''}`
    const repoDetailsNamePart = `${name ? `&name=${name}` : ''}`

    const newUrl =
      `/?search=${searchTerm ? searchTerm : ''}&page=${newPage}` +
      repoDetailsOwnerPart +
      repoDetailsNamePart
    router.replace(newUrl) //router.asPath
    setIsLoading(true)
  }

  useEffect(() => {
    setIsLoading(false)
  }, [repoSearch])

  // FlyOut callbacks
  const onUnselectAllInFlyoutClick = () => {
    setSelectedRepos([])
    setSelectedReposIds([])
  }

  const onDownloadInFlyoutClick = () => {
    const csvReposData = selectedRepos.map((item) => [
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
    link.download = `${selectedRepos.length}_repositories.csv`
    link.click()
    Log('downloading repos to csv')
  }

  return (
    <div className={'window-background ' + theme}>
      <div className={'container ' + theme}>
        <div className={classNames('gallery-page')}>
          <ThemeToggle></ThemeToggle>
          <Search
            searchTerm={searchTerm ? searchTerm : undefined}
            onSearchButtonClick={onSearchButtonClick}
          ></Search>

          <div className='cards-and-details'>
            <div className={classNames('card-gallery')} onClick={onCardGalleryClick}>
              <Pagination
                currentPage={currentPageNumber ? currentPageNumber : 1}
                numberOfPages={repoSearch ? repoSearch.total_count / 5 : 1}
                onPageChange={onPageChange}
              ></Pagination>
              <p>repos count {repoSearch.total_count}</p>
              {isLoading ? (
                <Loader></Loader>
              ) : repoSearch.items ? (
                repoSearch.items.map((item) => (
                  <Card
                    repository={item}
                    key={item.id}
                    selected={selectedReposIds.includes(item.id)} //{selectedCardIds.includes(item.id)}
                    onClick={onCardClick}
                    onSelectToggle={onSelectCardToggle}
                  ></Card>
                ))
              ) : (
                <p>Gallery have no repositories loaded</p>
              )}
            </div>
            {repoDetails && <CardDetails repo={repoDetails}></CardDetails>}
          </div>
          {selectedReposIds.length > 0 && (
            <FlyOut
              numberOfItems={selectedReposIds.length}
              onDownloadClick={onDownloadInFlyoutClick}
              onUnselectAllClick={onUnselectAllInFlyoutClick}
            ></FlyOut>
          )}
        </div>
      </div>
    </div>
  )
}
