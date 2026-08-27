import { fireEvent, render, screen } from '@testing-library/react';
import { IDialog, IDialogOutlet, IDialogProvider } from './dialog';

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

describe('IDialog actions', () => {
  it('does not invoke a disabled save action', () => {
    const onSave = vi.fn();

    render(
      <IDialog actions={[{ type: 'save', disabled: true }]} onSave={onSave} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  it('forwards the configured native button type', () => {
    render(<IDialog actions={[{ type: 'confirm', buttonType: 'submit' }]} />);

    expect(screen.getByRole('button', { name: 'Confirm' })).toHaveAttribute(
      'type',
      'submit'
    );
  });

  it('renders action loading state', () => {
    render(<IDialog actions={[{ type: 'ok', loading: true }]} />);

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button.closest('i-button')).toHaveAttribute('aria-busy', 'true');
  });
});
