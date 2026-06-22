export function readSingleValue(value?: string | string[]): string {
  return Array.isArray(value) ? value[0] ?? '' : value ?? '';
}

export function parsePositiveInt(value: string): number | null {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return null;
  }

  return parsed;
}

export function buildQuery(searchTerm: string, page: number, details?: number) {
  return {
    ...(searchTerm ? { q: searchTerm } : {}),
    page: page.toString(),
    ...(details ? { details: details.toString() } : {}),
  };
}
