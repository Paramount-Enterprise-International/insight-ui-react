import React from 'react';
import { render } from '@testing-library/react';
import { IDialogOutlet, IDialogProvider } from './dialog';

describe('IDialogOutlet', () => {
  it('renders empty outlet', () => {
    const { container } = render(
      <IDialogProvider>
        <IDialogOutlet />
      </IDialogProvider>
    );

    expect(container.querySelector('i-dialog-outlet')).toBeTruthy();
    expect(container.querySelector('i-dialog-container')).toBeNull();
  });
});
