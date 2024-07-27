import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { Loader } from '../../components/Loader/Loader'
import { useCSSThemeClass } from '../../hooks/useCSSThemeClass'
import { githubApi } from '../../services/githubApi'
import './CardDetails.css'

export default function CardDetails() {
  const { owner = 'facebook', name = 'react' } = useParams()
  const [searchParams] = useSearchParams()
  const { data, error, isLoading, isFetching } = githubApi.useGetRepositoryQuery({ name, owner })
  const navigate = useNavigate()
  const { classNames } = useCSSThemeClass()
  const onCloseButtonClick = () => {
    navigate(`/?${searchParams}`)
  }
  if (isLoading || isFetching) {
    return (
      <div className='card-details'>
        <Loader></Loader>
      </div>
    )
  } else {
    return (
      <div className='card-details'>
        {data ? (
          <>
            <img className='card-details__avatar' src={data?.owner?.avatar_url}></img>
            <h3 className='card-details__name'>{`Name:${data?.name}`}</h3>
            <h3 className='card-details__name'>{`Owner:${data?.owner?.login}`}</h3>
            <h3>Stars: {data?.stargazers_count}</h3>
            <h3>Forks: {data?.forks_count}</h3>
            <button className={classNames('')} onClick={onCloseButtonClick}>
              Close details
            </button>
          </>
        ) : (
          <div>
            Error fetching repository data due to
            {error
              ? 'status' in error
                ? error.status
                : error?.message
              : 'no data and no error mystery'}
          </div>
        )}
      </div>
    )
  }
}
