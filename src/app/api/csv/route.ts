import { NextResponse } from 'next/server';

import type { SelectedRepository } from '../../../store/selectionStore';
import { buildSelectedItemsCsv } from '../../../utils/selectedItemsCsv';

interface CsvPayload {
  selectedRepositories?: unknown;
}

function isSelectedRepository(value: unknown): value is SelectedRepository {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<SelectedRepository>;
  return (
    typeof candidate.id === 'number' &&
    typeof candidate.name === 'string' &&
    typeof candidate.description === 'string' &&
    typeof candidate.language === 'string' &&
    typeof candidate.htmlUrl === 'string' &&
    typeof candidate.detailsUrl === 'string'
  );
}

function isSelectedRepositoryList(value: unknown): value is SelectedRepository[] {
  return Array.isArray(value) && value.every((item) => isSelectedRepository(item));
}

export async function POST(request: Request) {
  let payload: CsvPayload;
  try {
    payload = (await request.json()) as CsvPayload;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 });
  }

  if (!isSelectedRepositoryList(payload.selectedRepositories)) {
    return NextResponse.json(
      { error: 'selectedRepositories must be an array of repositories' },
      { status: 400 }
    );
  }

  const selectedRepositories = payload.selectedRepositories;
  if (selectedRepositories.length === 0) {
    return NextResponse.json(
      { error: 'At least one selected repository is required' },
      { status: 400 }
    );
  }

  const csvContent = buildSelectedItemsCsv(selectedRepositories);
  const filename = `${selectedRepositories.length}_items.csv`;

  return new Response(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
