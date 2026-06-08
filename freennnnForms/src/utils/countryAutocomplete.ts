export function filterCountries(countries: string[], query: string): string[] {
  const normalizedQuery = query.trim().toLowerCase()

  if (!normalizedQuery) {
    return countries
  }

  const startsWithMatches = countries.filter((country) =>
    country.toLowerCase().startsWith(normalizedQuery),
  )

  if (startsWithMatches.length > 0) {
    return startsWithMatches
  }

  return countries.filter((country) => country.toLowerCase().includes(normalizedQuery))
}
