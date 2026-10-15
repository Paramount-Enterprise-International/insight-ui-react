import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { IInfoNotice } from './info-notice';
afterEach(cleanup);
describe('IInfoNotice', () => {
  it('hides empty messages', () => {
    render(<IInfoNotice message="  " />);
    expect(screen.queryByRole('status')).toBeNull();
  });
  it('renders the title and literal message with status semantics', () => {
    const { container } = render(
      <IInfoNotice title="Not available." message="<strong>Blocked</strong>" />
    );
    expect(screen.getByRole('status').textContent).toContain(
      '<strong>Blocked</strong>'
    );
    expect(container.querySelectorAll('strong')).toHaveLength(1);
  });
});
