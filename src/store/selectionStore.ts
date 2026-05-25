import { create } from 'zustand';

export interface SelectedRepository {
  id: number;
  name: string;
  description: string;
  language: string;
  htmlUrl: string;
  detailsUrl: string;
}

interface SelectionState {
  selectedRepositoryIds: number[];
  selectedRepositoriesById: Record<number, SelectedRepository>;
}

interface SelectionActions {
  selectRepository(repository: SelectedRepository): void;
  unselectRepository(id: number): void;
  toggleRepositorySelection(repository: SelectedRepository): void;
  clearSelection(): void;
}

export type SelectionStore = SelectionState & SelectionActions;

const initialSelectionState: SelectionState = {
  selectedRepositoryIds: [],
  selectedRepositoriesById: {},
};

export const useSelectionStore = create<SelectionStore>((set) => ({
  ...initialSelectionState,
  selectRepository: (repository) =>
    set((state) =>
      state.selectedRepositoryIds.includes(repository.id)
        ? {
            // select or refresh data - upsert
            selectedRepositoryIds: state.selectedRepositoryIds,
            selectedRepositoriesById: {
              ...state.selectedRepositoriesById,
              [repository.id]: repository,
            },
          }
        : {
            selectedRepositoryIds: [
              ...state.selectedRepositoryIds,
              repository.id,
            ],
            selectedRepositoriesById: {
              ...state.selectedRepositoriesById,
              [repository.id]: repository,
            },
          }
    ),
  unselectRepository: (id) =>
    set((state) => ({
      selectedRepositoryIds: state.selectedRepositoryIds.filter(
        (selectedId) => selectedId !== id
      ),
      selectedRepositoriesById: Object.fromEntries(
        Object.entries(state.selectedRepositoriesById).filter(
          ([selectedId]) => Number(selectedId) !== id
        )
      ),
    })),
  toggleRepositorySelection: (repository) =>
    set((state) =>
      state.selectedRepositoryIds.includes(repository.id)
        ? {
            selectedRepositoryIds: state.selectedRepositoryIds.filter(
              (selectedId) => selectedId !== repository.id
            ),
            selectedRepositoriesById: Object.fromEntries(
              Object.entries(state.selectedRepositoriesById).filter(
                ([selectedId]) => Number(selectedId) !== repository.id
              )
            ),
          }
        : {
            selectedRepositoryIds: [
              ...state.selectedRepositoryIds,
              repository.id,
            ],
            selectedRepositoriesById: {
              ...state.selectedRepositoriesById,
              [repository.id]: repository,
            },
          }
    ),
  clearSelection: () =>
    set(() => ({
      selectedRepositoryIds: [],
      selectedRepositoriesById: {},
    })),
}));

export const selectionSelectors = {
  selectedRepositoryIds: (state: SelectionStore) => state.selectedRepositoryIds,
  selectedCount: (state: SelectionStore) => state.selectedRepositoryIds.length,
  selectedRepositories: (state: SelectionStore) =>
    state.selectedRepositoryIds
      .map((id) => state.selectedRepositoriesById[id])
      .filter((repository): repository is SelectedRepository =>
        Boolean(repository)
      ),
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
