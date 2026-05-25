import {
  selectionSelectors,
  useSelectionStore,
} from '../../store/selectionStore';
import './SelectedItemsFlyout.css';

interface SelectedItemsFlyoutProps {
  onDownloadSelected?(): void;
}

export function SelectedItemsFlyout({
  onDownloadSelected,
}: SelectedItemsFlyoutProps) {
  const selectedCount = useSelectionStore(selectionSelectors.selectedCount);
  const clearSelection = useSelectionStore((state) => state.clearSelection);

  if (selectedCount === 0) {
    return null;
  }

  return (
    <section className="selected-items-flyout" aria-label="Selected items summary">
      <p className="selected-items-flyout-count">
        Selected items: <strong>{selectedCount}</strong>
      </p>
      <div className="selected-items-flyout-actions">
        <button type="button" onClick={clearSelection}>
          Unselect all
        </button>
        <button type="button" onClick={() => onDownloadSelected?.()}>
          Download
        </button>
      </div>
    </section>
  );
}
