import { useState } from 'react';
import { ILoadError, type ILoadErrorDensity } from '../../components';
export function LoadErrorDemo() {
  const densities: ILoadErrorDensity[] = ['default', 'compact', 'inline'];
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  return (
    <div className="flex flex-col gap-lg p-lg">
      <h1>Load Error</h1>
      <label>
        <input
          type="checkbox"
          checked={disabled}
          onChange={(event) => setDisabled(event.target.checked)}
        />{' '}
        Disable Retry
      </label>
      <label>
        <input
          type="checkbox"
          checked={loading}
          onChange={(event) => setLoading(event.target.checked)}
        />{' '}
        Retry Loading
      </label>
      <p>Retry requests: {attempts}</p>
      {densities.map((density) => (
        <ILoadError
          key={density}
          title="Unable to load records"
          message="The service is temporarily unavailable."
          density={density}
          retryDisabled={disabled}
          retryLoading={loading}
          onRetry={() => setAttempts(attempts + 1)}
        />
      ))}
    </div>
  );
}
