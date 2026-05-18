import { Repository } from '../../views/Gallery/Gallery';
import './GalleryItem.css';

type GalleryItemProps = Repository;

export function GalleryItem({ name, description, language }: GalleryItemProps) {
  return (
    <div className="GalleryItem">
      <p>{name}</p>
      <p>{description}</p>
      <p>{language}</p>
    </div>
  );
}
