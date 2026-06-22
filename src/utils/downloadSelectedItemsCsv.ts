import type { SelectedRepository } from '../store/selectionStore';
import { buildSelectedItemsCsv } from './selectedItemsCsv';

export { buildSelectedItemsCsv };

function parseFilenameFromContentDisposition(
  contentDisposition: string | null,
  fallbackFilename: string
): string {
  if (!contentDisposition) {
    return fallbackFilename;
  }

  const filenameMatch = contentDisposition.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i);
  if (!filenameMatch) {
    return fallbackFilename;
  }

  const rawFilename = filenameMatch[1]?.trim();
  if (!rawFilename) {
    return fallbackFilename;
  }

  try {
    return decodeURIComponent(rawFilename.replace(/"/g, ''));
  } catch {
    return rawFilename.replace(/"/g, '');
  }
}

export async function downloadSelectedItemsCsv(
  selectedRepositories: SelectedRepository[]
): Promise<void> {
  if (selectedRepositories.length === 0) {
    return;
  }

  const response = await fetch('/api/csv', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ selectedRepositories }),
  });

  if (!response.ok) {
    throw new Error(`CSV export failed (${response.status})`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const fallbackFilename = `${selectedRepositories.length}_items.csv`;
  link.download = parseFilenameFromContentDisposition(
    response.headers.get('content-disposition'),
    fallbackFilename
  );
  link.href = url;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
