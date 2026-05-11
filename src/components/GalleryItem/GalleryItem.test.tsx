import { render, screen } from '../../test-utils/render'
import { GalleryItem } from './GalleryItem'

describe('GalleryItem', () => {
  it('renders repository name, description, and language', () => {
    render(
      <GalleryItem
        id={1}
        name="tanstack/query"
        description="Powerful async state management"
        language="TypeScript"
      />
    )

    expect(screen.getByText('tanstack/query')).toBeInTheDocument()
    expect(
      screen.getByText('Powerful async state management')
    ).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })
})
