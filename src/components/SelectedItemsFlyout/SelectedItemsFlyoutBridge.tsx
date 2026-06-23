'use client';

import { useShallow } from 'zustand/react/shallow';

import {
  selectionSelectors,
  useSelectionStore,
} from '../../store/selectionStore';
import { downloadSelectedItemsCsv } from '../../utils/downloadSelectedItemsCsv';
import { SelectedItemsFlyout } from './SelectedItemsFlyout';

export function SelectedItemsFlyoutBridge() {
  const selectedRepositories = useSelectionStore(
    useShallow(selectionSelectors.selectedRepositories)
  );

  return (
    <SelectedItemsFlyout
      onDownloadSelected={() => {
        void downloadSelectedItemsCsv(selectedRepositories);
      }}
    />
  );
}
