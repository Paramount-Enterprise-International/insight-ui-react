import type { IEmptyStateKind } from './empty-state';
export const I_EMPTY_STATE_PRESETS: Record<
  IEmptyStateKind,
  { title: string; description: string; icon: string }
> = {
  empty: {
    title: 'No data available.',
    description: '',
    icon: 'fa-solid fa-folder-open',
  },
  search: {
    title: 'No data matches your search.',
    description: 'Try a different keyword.',
    icon: 'fa-solid fa-magnifying-glass',
  },
  filter: {
    title: 'No data matches the selected filters.',
    description: 'Adjust or clear the filters.',
    icon: 'fa-solid fa-filter',
  },
  'search-filter': {
    title: 'No data matches your search and selected filters.',
    description: 'Try a different keyword or clear the filters.',
    icon: 'fa-solid fa-filter',
  },
  prerequisite: {
    title: 'Additional information is required.',
    description: '',
    icon: 'fa-solid fa-circle-info',
  },
};
