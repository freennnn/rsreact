import { create } from 'zustand';

interface SelectionState {
  selectedRepositoryIds: number[];
}

interface SelectionActions {
  selectRepository(id: number): void;
  unselectRepository(id: number): void;
  toggleRepositorySelection(id: number): void;
  clearSelection(): void;
}

export type SelectionStore = SelectionState & SelectionActions;

const initialSelectionState: SelectionState = {
  selectedRepositoryIds: [],
};

export const useSelectionStore = create<SelectionStore>((set) => ({
  ...initialSelectionState,
  selectRepository: (id) =>
    set((state) =>
      state.selectedRepositoryIds.includes(id)
        ? state
        : {
            selectedRepositoryIds: [...state.selectedRepositoryIds, id],
          }
    ),
  unselectRepository: (id) =>
    set((state) => ({
      selectedRepositoryIds: state.selectedRepositoryIds.filter(
        (selectedId) => selectedId !== id
      ),
    })),
  toggleRepositorySelection: (id) =>
    set((state) =>
      state.selectedRepositoryIds.includes(id)
        ? {
            selectedRepositoryIds: state.selectedRepositoryIds.filter(
              (selectedId) => selectedId !== id
            ),
          }
        : {
            selectedRepositoryIds: [...state.selectedRepositoryIds, id],
          }
    ),
  clearSelection: () =>
    set(() => ({
      selectedRepositoryIds: [],
    })),
}));

export const selectionSelectors = {
  selectedRepositoryIds: (state: SelectionStore) => state.selectedRepositoryIds,
  selectedCount: (state: SelectionStore) => state.selectedRepositoryIds.length,
};

export function isRepositorySelected(
  state: SelectionStore,
  repositoryId: number
): boolean {
  return state.selectedRepositoryIds.includes(repositoryId);
}

export function resetSelectionStore(): void {
  useSelectionStore.setState(initialSelectionState);
}
