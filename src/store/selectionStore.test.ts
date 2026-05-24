import {
  resetSelectionStore,
  selectionSelectors,
  useSelectionStore,
} from './selectionStore';

describe('selectionStore', () => {
  afterEach(() => {
    resetSelectionStore();
  });

  it('starts with an empty selection', () => {
    const state = useSelectionStore.getState();

    expect(selectionSelectors.selectedRepositoryIds(state)).toEqual([]);
    expect(selectionSelectors.selectedCount(state)).toBe(0);
  });

  it('selects a repository only once', () => {
    const { selectRepository } = useSelectionStore.getState();

    selectRepository(10);
    selectRepository(10);

    const state = useSelectionStore.getState();
    expect(state.selectedRepositoryIds).toEqual([10]);
  });

  it('unselects an existing repository', () => {
    const { selectRepository, unselectRepository } =
      useSelectionStore.getState();

    selectRepository(10);
    selectRepository(20);
    unselectRepository(10);

    const state = useSelectionStore.getState();
    expect(state.selectedRepositoryIds).toEqual([20]);
  });

  it('toggles repository selection', () => {
    const { toggleRepositorySelection } = useSelectionStore.getState();

    toggleRepositorySelection(10);
    expect(useSelectionStore.getState().selectedRepositoryIds).toEqual([10]);

    toggleRepositorySelection(10);
    expect(useSelectionStore.getState().selectedRepositoryIds).toEqual([]);
  });

  it('clears selected repositories', () => {
    const { selectRepository, clearSelection } = useSelectionStore.getState();

    selectRepository(1);
    selectRepository(2);
    clearSelection();

    const state = useSelectionStore.getState();
    expect(state.selectedRepositoryIds).toEqual([]);
    expect(selectionSelectors.selectedCount(state)).toBe(0);
  });
});
