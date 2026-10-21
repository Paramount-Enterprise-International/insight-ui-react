import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { IRouteAccessContext } from './route-access-context';
import { IRouteAccessDenied } from './route-access-denied';

describe('route denial presentation', () => {
  it('uses the existing error page and clears its host metadata when unmounted', () => {
    const report = vi.fn();
    const view = render(
      <IRouteAccessContext.Provider value={report}>
        <IRouteAccessDenied />
      </IRouteAccessContext.Provider>
    );
    expect(screen.getByText('Unauthorized Access')).toBeTruthy();
    const owner = report.mock.calls[0][0];
    expect(report).toHaveBeenLastCalledWith(owner, true);
    view.unmount();
    expect(report).toHaveBeenLastCalledWith(owner, false);
  });
});
