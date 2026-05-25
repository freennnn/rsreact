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

export function downloadSelectedItemsCsv(
  selectedRepositories: SelectedRepository[]
): void {
  if (selectedRepositories.length === 0) {
    return;
  }

  const csvContent = buildSelectedItemsCsv(selectedRepositories);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${selectedRepositories.length}_items.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
