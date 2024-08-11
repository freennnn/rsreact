import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import { Loader } from '../../components/Loader/Loader'
import { Repository } from '../../data/types'
import { useCssClassWithTheme } from '../../hooks/useCssClassWithTheme'
import styles from './CardDetails.module.css'

export default function CardDetails({ repo }: { repo: Repository }) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const { classNames } = useCssClassWithTheme()

  const searchTerm = router.query.search as string | undefined
  let сurrentPageNumber = router.query.page as number | undefined
  if (сurrentPageNumber === undefined) сurrentPageNumber = 1

  const onCloseButtonClick = () => {
    const newUrl = `/?search=${searchTerm ? searchTerm : ''}&page=${сurrentPageNumber}`
    router.replace(newUrl) //router.asPath
  }

  useEffect(() => {
    setIsLoading(false)
  }, [repo])

  if (isLoading) {
    return (
      <div className='card-details'>
        <Loader></Loader>
      </div>
    )
  } else {
    return (
      <div className={styles['card-details']}>
        {repo ? (
          <>
            <img className={styles['card-details__avatar']} src={repo.owner?.avatar_url}></img>
            <h3 className='card-details__name'>{`Name:${repo.name}`}</h3>
            <h3 className='card-details__name'>{`Owner:${repo.owner?.login}`}</h3>
            <h3>Stars: {repo.stargazers_count}</h3>
            <h3>Forks: {repo.forks_count}</h3>
            <button className={classNames('')} onClick={onCloseButtonClick}>
              Close details
            </button>
          </>
        ) : (
          <div>Error fetching repository data due to</div>
        )}
      </div>
    )
  }
}
