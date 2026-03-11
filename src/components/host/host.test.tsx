import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { IHContent } from './host';

describe('IHContent', () => {
  it('renders host and title', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route element={<IHContent title="Dashboard" breadcrumbs={[]} />}>
            <Route index element={<div>Body</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(container.querySelector('ih-content')).toBeTruthy();
    expect(container.querySelector('ih-content h1')?.textContent).toContain(
      'Dashboard'
    );
  });
});
