import { Country } from '../types/country';
import { CountryCard } from './CountryCard';
import './CountryList.css';

interface CountryListProps {
  countries: Country[];
}

export function CountryList({ countries }: CountryListProps) {
  return (
    <div className="country-list">
      {countries.map((country) => (
        <div key={country.name} className="country-item">
          <CountryCard country={country} />
        </div>
      ))}
    </div>
  );
}
