import { Country } from '../types/country';
import { CountryCard } from './CountryCard';
import './CountryList.css';

interface CountryListProps {
  countries: Country[];
  visitedCountries: Set<string>;
  onToggleVisited: (countryName: string) => void;
}

export function CountryList({
  countries,
  visitedCountries,
  onToggleVisited,
}: CountryListProps) {
  if (countries.length === 0) {
    return (
      <div className="no-results">
        No countries found matching your criteria.
      </div>
    );
  }

  return (
    <div className="country-list">
      {countries.map((country) => (
        <CountryCard
          key={country.name}
          country={country}
          visited={visitedCountries.has(country.name)}
          onToggleVisited={onToggleVisited}
        />
      ))}
    </div>
  );
}
