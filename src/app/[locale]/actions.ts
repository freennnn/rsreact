'use server';

import { redirect } from 'next/navigation';

function normalizeSearchTerm(rawSearchTerm: FormDataEntryValue | null): string {
  if (typeof rawSearchTerm !== 'string') {
    return '';
  }

  return rawSearchTerm.trim();
}

export async function submitSearchAction(
  locale: string,
  formData: FormData
): Promise<void> {
  const searchTerm = normalizeSearchTerm(formData.get('q'));
  const queryParams = new URLSearchParams();
  queryParams.set('page', '1');

  if (searchTerm !== '') {
    queryParams.set('q', searchTerm);
  }

  redirect(`/${locale}?${queryParams.toString()}`);
}
