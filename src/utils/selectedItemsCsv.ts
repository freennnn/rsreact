import type { SelectedRepository } from '../store/selectionStore';

const CSV_HEADERS = [
  'id',
  'name',
  'description',
  'language',
  'details_url',
  'repository_url',
];

function escapeCsvValue(value: string): string {
  const escapedValue = value.replace(/"/g, '""');
  return `"${escapedValue}"`;
}

export function buildSelectedItemsCsv(
  selectedRepositories: SelectedRepository[]
): string {
  const rows = selectedRepositories.map((repository) =>
    [
      repository.id.toString(),
      repository.name,
      repository.description,
      repository.language,
      repository.detailsUrl,
      repository.htmlUrl,
    ]
      .map(escapeCsvValue)
      .join(',')
  );

  return [CSV_HEADERS.join(','), ...rows].join('\n');
}
