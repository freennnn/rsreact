import './Filter.css';

interface FilterProps {
  regions: string[];
  selectedRegion: string;
  onFilterChange: (region: string) => void;
}

export function Filter({
  regions,
  selectedRegion,
  onFilterChange,
}: FilterProps) {
  return (
    <div className="filter-container">
      <select
        value={selectedRegion}
        onChange={(e) => onFilterChange(e.target.value)}
        className="filter-select"
      >
        <option value="">All Regions</option>
        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}
      </select>
    </div>
  );
}
