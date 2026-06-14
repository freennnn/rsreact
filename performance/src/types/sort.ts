export type SortField = 'name' | 'population';
export type SortOrder = 'asc' | 'desc';

export const SORT_FIELDS: SortField[] = ['name', 'population'] as const;
export const SORT_ORDERS: SortOrder[] = ['asc', 'desc'] as const;

export const SORT_OPTIONS = [
  { value: `${SORT_FIELDS[0]}-${SORT_ORDERS[0]}`, label: 'Name (a-z)' },
  { value: `${SORT_FIELDS[0]}-${SORT_ORDERS[1]}`, label: 'Name (z-a)' },
  {
    value: `${SORT_FIELDS[1]}-${SORT_ORDERS[0]}`,
    label: 'Population (Low to High)',
  },
  {
    value: `${SORT_FIELDS[1]}-${SORT_ORDERS[1]}`,
    label: 'Population (High to Low)',
  },
] as const;
