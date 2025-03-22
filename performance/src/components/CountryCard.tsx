import { Country } from '../types/country';
import './CountryCard.css';

interface CountryCardProps {
  country: Country;
}

export function CountryCard({ country }: CountryCardProps) {
  return (
    <div className="country-card">
      <div className="flag-container">
        <img
          src={country.flag}
          alt={`Flag of ${country.name}`}
          className="flag-image"
        />
      </div>
      <div className="card-content">
        <h2 className="country-name">{country.name}</h2>
        <div className="country-details">
          <p className="detail-item">
            <span className="detail-label">Population:</span>{' '}
            {country.population.toLocaleString()}
          </p>
          <p className="detail-item">
            <span className="detail-label">Region:</span> {country.region}
          </p>
        </div>
      </div>
    </div>
  );
}
