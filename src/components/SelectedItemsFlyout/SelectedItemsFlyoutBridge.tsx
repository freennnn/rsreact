'use client';

import { selectionSelectors, useSelectionStore } from '../../store/selectionStore';
import { downloadSelectedItemsCsv } from '../../utils/downloadSelectedItemsCsv';
import { SelectedItemsFlyout } from './SelectedItemsFlyout';

export function SelectedItemsFlyoutBridge() {
  const selectedRepositories = useSelectionStore(
    selectionSelectors.selectedRepositories
  );

  return (
    <SelectedItemsFlyout
      onDownloadSelected={() => {
        void downloadSelectedItemsCsv(selectedRepositories);
      }}
    />
  );
}
