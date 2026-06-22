export default function SearchPageLoading() {
  return (
    <div className="list-layout">
      <section className="list-layout-master" aria-label="Repository list panel">
        <div className="GalleryView">
          <section className="gallery-search-section" aria-label="Search repositories">
            <p>Loading search controls...</p>
          </section>
          <section className="gallery-results-section" aria-label="Search results">
            <p className="gallery-empty">Loading repositories...</p>
          </section>
        </div>
      </section>
      <section className="list-layout-detail" aria-label="Repository detail panel">
        <aside className="app-page details-panel">
          <h2>Repository details</h2>
          <p>Loading details panel...</p>
        </aside>
      </section>
    </div>
  );
}
