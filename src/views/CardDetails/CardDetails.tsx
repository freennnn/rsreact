import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Loader } from '../../components/Loader/Loader'
import { Repository } from '../../pages/GalleryPage/GalleryPage'
import { getRepository } from '../../services/api'
import { Log, LogError } from '../../utils/utils'
import './CardDetails.css'

export default function CardDetails() {
  const { owner, name } = useParams()
  //const repoFromProps = useLocation().state as Repository | null
  const [isLoading, setIsLoading] = useState(false)
  const [repo, setRepo] = useState<Repository>()
  const navigate = useNavigate()
  const onCloseButtonClick = () => {
    navigate('/')
  }

  useEffect(() => {
    const fetchRepository = async (owner: string, name: string) => {
      setIsLoading(true)
      try {
        const results = await getRepository(owner, name)
        Log(results)
        setRepo(results as Repository)
      } catch (e) {
        LogError(e)
      } finally {
        setIsLoading(false)
      }
    }
    if (owner && name) {
      fetchRepository(owner, name)
    }
  }, [owner, name])

  //const data: CardData = { name: 'Alex', imageUrl: 'hx' }
  if (isLoading) {
    return (
      <div className='card-details'>
        <Loader></Loader>
      </div>
    )
  } else {
    return (
      <div className='card-details'>
        <img className='card-details__avatar' src={repo?.owner?.avatar_url}></img>
        <h3 className='card-details__name'>{`Name:${repo?.name}`}</h3>
        <h3 className='card-details__name'>{`Owner:${repo?.owner?.login}`}</h3>
        <h3>Stars: {repo?.stargazers_count}</h3>
        <h3>Forks: {repo?.forks_count}</h3>
        <button onClick={onCloseButtonClick}>Close details</button>
      </div>
    )
  }
}
