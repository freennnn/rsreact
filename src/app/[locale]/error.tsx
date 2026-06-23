'use client';

interface SearchPageErrorProps {
  error: Error;
  reset: () => void;
}

export default function SearchPageError({
  error,
  reset,
}: SearchPageErrorProps) {
  return (
    <section className="app-page" aria-label="Search page error">
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
