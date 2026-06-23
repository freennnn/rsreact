import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import type { SelectedRepository } from '../store/selectionStore';
import {
  buildSelectedItemsCsv,
  downloadSelectedItemsCsv,
} from './downloadSelectedItemsCsv';

const sampleRepositories: SelectedRepository[] = [
  {
    id: 1,
    name: 'tanstack/query',
    description: 'Powerful "async" state, management',
    language: 'TypeScript',
    htmlUrl: 'https://github.com/tanstack/query',
    detailsUrl: 'https://github.com/tanstack/query',
  },
];

describe('downloadSelectedItemsCsv', () => {
  const originalCreateObjectURL = URL.createObjectURL;
  const originalRevokeObjectURL = URL.revokeObjectURL;
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => 'blob:csv-data');
    URL.revokeObjectURL = vi.fn();
    globalThis.fetch = vi.fn(async () => {
      const blob = new Blob(['csv']);
      return new Response(blob, {
        status: 200,
        headers: {
          'Content-Disposition': 'attachment; filename="1_items.csv"',
        },
      });
    }) as typeof fetch;
  });

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL;
    URL.revokeObjectURL = originalRevokeObjectURL;
    globalThis.fetch = originalFetch;
  });

  it('builds CSV content with headers and escaped values', () => {
    const csv = buildSelectedItemsCsv(sampleRepositories);

    expect(csv).toContain(
      'id,name,description,language,details_url,repository_url'
    );
    expect(csv).toContain('"1","tanstack/query"');
    expect(csv).toContain('"Powerful ""async"" state, management"');
  });

  it('does not trigger download when there are no selected items', async () => {
    const createObjectUrlSpy = vi.spyOn(URL, 'createObjectURL');

    await downloadSelectedItemsCsv([]);

    expect(createObjectUrlSpy).not.toHaveBeenCalled();
    createObjectUrlSpy.mockRestore();
  });

  it('downloads a CSV file using native browser APIs', async () => {
    const anchorMock = document.createElement('a');
    const anchorClickSpy = vi
      .spyOn(anchorMock, 'click')
      .mockImplementation(() => undefined);
    const createElementSpy = vi
      .spyOn(document, 'createElement')
      .mockReturnValue(anchorMock);
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    const removeChildSpy = vi.spyOn(document.body, 'removeChild');
    const createObjectUrlSpy = vi.spyOn(URL, 'createObjectURL');
    const revokeObjectUrlSpy = vi.spyOn(URL, 'revokeObjectURL');
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    await downloadSelectedItemsCsv(sampleRepositories);

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    expect(createObjectUrlSpy).toHaveBeenCalledTimes(1);
    expect(anchorClickSpy).toHaveBeenCalledTimes(1);
    expect(appendChildSpy).toHaveBeenCalledTimes(1);
    expect(removeChildSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectUrlSpy).toHaveBeenCalledWith('blob:csv-data');

    const appendedNode = appendChildSpy.mock.calls[0][0] as HTMLAnchorElement;
    expect(appendedNode.download).toBe('1_items.csv');

    fetchSpy.mockRestore();
    createElementSpy.mockRestore();
    anchorClickSpy.mockRestore();
    appendChildSpy.mockRestore();
    removeChildSpy.mockRestore();
  });
});
