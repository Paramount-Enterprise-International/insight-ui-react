import { fireEvent, render, screen } from '@testing-library/react';
import { IDialog, IDialogContainer, IDialogOutlet, IDialogProvider, useIDialog, useIDialogData, useIDialogRef } from './dialog';

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


describe('IDialogContainer controlled content', () => {
  it('renders children without a provider and requests closure without owning visibility', () => {
    const onClose = vi.fn();
    const { container, rerender } = render(
      <IDialogContainer config={{ width: '380px' }} onClose={onClose}>
        <IDialog title="Controlled dialog" actions={[]}>Content</IDialog>
      </IDialogContainer>
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    expect(container.querySelector('.i-dialog-panel')).toHaveStyle({ width: '380px' });
    fireEvent.click(container.querySelector('.i-dialog-backdrop')!);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
    expect(screen.getByText('Content')).toBeTruthy();
    rerender(<IDialogContainer config={{ disableClose: true }} onClose={onClose}>Content</IDialogContainer>);
    fireEvent.click(container.querySelector('.i-dialog-backdrop')!);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
    rerender(<IDialogContainer config={{ backdropClose: false }} onClose={onClose}>Content</IDialogContainer>);
    fireEvent.click(container.querySelector('.i-dialog-backdrop')!);
    expect(onClose).toHaveBeenCalledTimes(2);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(3);
    rerender(<IDialogContainer isTopMost={false} onClose={onClose}>Content</IDialogContainer>);
    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.click(container.querySelector('.i-dialog-backdrop')!);
    expect(onClose).toHaveBeenCalledTimes(3);
  });
});

function ServiceContent() {
  const data = useIDialogData<{ title: string }>();
  const ref = useIDialogRef<string>();
  return <IDialog title={data.title} actions={['ok']} onOk={() => ref.close('confirmed')} />;
}
function OpenServiceDialog({ onResult }: { onResult: (value?: string) => void }) {
  const dialog = useIDialog();
  return <button onClick={() => {
    dialog.open<{ title: string }, string>(ServiceContent, { data: { title: 'Service dialog' } }).subscribe(onResult);
  }}>Open</button>;
}

describe('service dialog compatibility', () => {
  it('injects instance data and ref, then removes the closed dialog', () => {
    const onResult = vi.fn();
    render(<IDialogProvider><OpenServiceDialog onResult={onResult} /><IDialogOutlet /></IDialogProvider>);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Service dialog')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(onResult).toHaveBeenCalledWith('confirmed');
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
