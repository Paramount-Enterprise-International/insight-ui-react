import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { IGrid, IGridColumn, IGridDataSource } from './grid';

describe('IGrid', () => {
  it('renders basic grid structure', async () => {
    const dataSource = new IGridDataSource([{ name: 'Alice' }]);

    const { container } = render(
      <IGrid dataSource={dataSource}>
        <IGridColumn title="Name" fieldName="name" />
      </IGrid>
    );

    expect(container.querySelector('i-grid')).toBeTruthy();
    expect(container.querySelector('i-grid-header-row')).toBeTruthy();

    await waitFor(() => {
      expect(container.querySelector('i-grid-row')).toBeTruthy();
    });
  });
});
