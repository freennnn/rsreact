import {
  resetSelectionStore,
  selectionSelectors,
  useSelectionStore,
} from './selectionStore';

const repositoryTen = {
  id: 10,
  name: 'repo-ten',
  description: 'Repo ten description',
  language: 'TypeScript',
  htmlUrl: 'https://github.com/example/repo-ten',
  detailsUrl: 'https://github.com/example/repo-ten',
};

const repositoryTwenty = {
  id: 20,
  name: 'repo-twenty',
  description: 'Repo twenty description',
  language: 'JavaScript',
  htmlUrl: 'https://github.com/example/repo-twenty',
  detailsUrl: 'https://github.com/example/repo-twenty',
};

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

    selectRepository(repositoryTen);
    selectRepository(repositoryTen);

    const state = useSelectionStore.getState();
    expect(state.selectedRepositoryIds).toEqual([10]);
    expect(selectionSelectors.selectedRepositories(state)).toEqual([
      repositoryTen,
    ]);
  });

  it('unselects an existing repository', () => {
    const { selectRepository, unselectRepository } =
      useSelectionStore.getState();

    selectRepository(repositoryTen);
    selectRepository(repositoryTwenty);
    unselectRepository(10);

    const state = useSelectionStore.getState();
    expect(state.selectedRepositoryIds).toEqual([20]);
    expect(selectionSelectors.selectedRepositories(state)).toEqual([
      repositoryTwenty,
    ]);
  });

  it('toggles repository selection', () => {
    const { toggleRepositorySelection } = useSelectionStore.getState();

    toggleRepositorySelection(repositoryTen);
    expect(useSelectionStore.getState().selectedRepositoryIds).toEqual([10]);

    toggleRepositorySelection(repositoryTen);
    expect(useSelectionStore.getState().selectedRepositoryIds).toEqual([]);
  });

  it('clears selected repositories', () => {
    const { selectRepository, clearSelection } = useSelectionStore.getState();

    selectRepository({
      id: 1,
      name: 'repo-one',
      description: '',
      language: '',
      htmlUrl: 'https://github.com/example/repo-one',
      detailsUrl: 'https://github.com/example/repo-one',
    });
    selectRepository({
      id: 2,
      name: 'repo-two',
      description: '',
      language: '',
      htmlUrl: 'https://github.com/example/repo-two',
      detailsUrl: 'https://github.com/example/repo-two',
    });
    clearSelection();

    const state = useSelectionStore.getState();
    expect(state.selectedRepositoryIds).toEqual([]);
    expect(selectionSelectors.selectedRepositories(state)).toEqual([]);
    expect(selectionSelectors.selectedCount(state)).toBe(0);
  });
});
