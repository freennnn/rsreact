import { Outlet } from 'react-router-dom'

import { Gallery } from '../../views/Gallery/Gallery'
import './GalleryPage.css'

export default function GalleryPage() {
  return (
    <div className='gallery-page'>
      <Gallery></Gallery>
      <Outlet></Outlet>
    </div>
  )
}
