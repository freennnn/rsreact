import React from 'react'

import { Repository } from '../../views/Gallery/Gallery'
import './GalleryItem.css'

interface GalleryItemProps extends Repository {}

export class GalleryItem extends React.Component<GalleryItemProps> {
  render() {
    return (
      <div className='GalleryItem'>
        <p>{this.props.name}</p>
        <p>{this.props.description}</p>
        <p>{this.props.language}</p>
      </div>
    )
  }
}
