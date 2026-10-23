import { useState } from 'react';
import { IHighlightSearch } from '../../components';
export function HighlightSearchDemo() {
  const [value, setValue] = useState(
    'Literal <strong>HTML</strong>, [regex], and Search SEARCH.'
  );
  const [search, setSearch] = useState('search');
  return (
    <div className="flex flex-col gap-lg p-lg">
      <h1>Highlight Search</h1>
      <label>
        Value{' '}
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </label>
      <label>
        Search{' '}
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </label>
      <p>
        <IHighlightSearch value={value} search={search} />
      </p>
      <p>
        Numeric value: <IHighlightSearch value={12345} search={search} />
      </p>
      <p>
        Null: <IHighlightSearch value={null} search={search} />
      </p>
      <p className="truncate" style={{ maxWidth: 320 }}>
        <IHighlightSearch value={value} search={search} />
      </p>
    </div>
  );
}
