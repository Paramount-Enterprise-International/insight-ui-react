import { useState } from 'react';
import {
  IButton,
  IEmptyState,
  IGrid,
  IGridColumn,
  IGridDataSource,
  IHighlightSearch,
  ILoadingRegion,
  ISection,
  ISectionBody,
  ISectionFilter,
  ISectionHeader,
  type IEmptyStateKind,
} from '../../components';
export function EmptyStateDemo() {
  const kinds: IEmptyStateKind[] = [
    'empty',
    'search',
    'filter',
    'search-filter',
    'prerequisite',
  ];
  const [kind, setKind] = useState<IEmptyStateKind>('empty');
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [actions, setActions] = useState(0);
  const [emptyData] = useState(
    () =>
      new IGridDataSource<{ name: string }>([], { paginator: { pageSize: 10 } })
  );
  const [searchData] = useState(
    () =>
      new IGridDataSource(
        Array.from({ length: 12 }, (_, index) => ({
          name: 'Record ' + (index + 1),
        })),
        { paginator: { pageSize: 10 } }
      )
  );
  return (
    <div className="flex flex-col gap-lg p-lg">
      <h1>Empty State</h1>
      <h2>Stable initial loading and empty height</h2>
      <IButton onClick={() => setLoading(!loading)}>Toggle Loading</IButton>
      <ISection>
        <ISectionHeader>Initially empty</ISectionHeader>
        <ISectionBody>
          <ILoadingRegion loading={loading}>
            {({ hasLoaded }) =>
              !loading || hasLoaded ? (
                <IGrid dataSource={emptyData}>
                  <IGridColumn fieldName="name" title="Name" />
                </IGrid>
              ) : null
            }
          </ILoadingRegion>
        </ISectionBody>
      </ISection>
      <h2>Search and pagination</h2>
      <ISection>
        <ISectionFilter>
          <label>
            Search{' '}
            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                searchData.filter = event.target.value;
              }}
            />
          </label>
        </ISectionFilter>
        <ISectionBody>
          <IGrid dataSource={searchData}>
            <IGridColumn
              fieldName="name"
              title="Name"
              cellDef={(row: { name: string }) => (
                <IHighlightSearch value={row.name} search={search} />
              )}
            />
          </IGrid>
        </ISectionBody>
      </ISection>
      <h2>Standalone states</h2>
      <label>
        Kind{' '}
        <select
          value={kind}
          onChange={(event) => setKind(event.target.value as IEmptyStateKind)}>
          {kinds.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <IEmptyState kind={kind}>
        <IButton size="xs" onClick={() => setActions(actions + 1)}>
          Example CTA {actions}
        </IButton>
      </IEmptyState>
      <IEmptyState density="compact" kind={kind} />
    </div>
  );
}
