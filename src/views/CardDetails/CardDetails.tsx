import './CardDetails.css'

export interface CardData {
  name: string
  imageUrl: string
}
const CardDetails = () => {
  const data: CardData = { name: 'Alex', imageUrl: 'hx' }
  return (
    <div className='card-details'>
      <h3 className='card-details__name'>{data.name}</h3>
      <img src={data.imageUrl}></img>
    </div>
  )
}

export default CardDetails
