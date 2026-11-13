import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import {
  IDialog,
  IDialogContainer,
  IDialogOutlet,
  IDialogProvider,
  useIAlert,
  useIConfirm,
  useIDialog,
  useIDialogData,
  useIDialogRef,
} from './dialog';

function OpenDescriptionDialog({
  description,
  reason = false,
  onResult,
}: {
  description: string;
  reason?: boolean;
  onResult: (value: unknown) => void;
}) {
  const alert = useIAlert();
  const confirm = useIConfirm();
  return (
    <>
      <button
        onClick={() => {
          void alert.warning('Notice', description).then(onResult);
        }}>
        Open Alert
      </button>
      <button
        onClick={() => {
          void confirm.warning('Notice', description, reason).then(onResult);
        }}>
        Open Confirm
      </button>
    </>
  );
}

describe('Alert and Confirm description security', () => {
  const description =
    '<strong onclick="alert(1)" class="unsafe" data-test="x" aria-label="unsafe">Name</strong>' +
    '<br><b>B</b><em>E</em><i>I</i>' +
    '<script>alert(1)</script><img src="x" onerror="alert(1)">' +
    '<svg onload="alert(1)"></svg><iframe srcdoc="unsafe"></iframe>' +
    '<a href="javascript:alert(1)">Link</a><input autofocus>' +
    '&lt;b&gt;Literal&lt;/b&gt; &amp; O&#39;Brien';

  for (const kind of ['Alert', 'Confirm']) {
    it(`sanitizes the rendered ${kind} while retaining formatting and escaped names`, () => {
      render(
        <IDialogProvider>
          <OpenDescriptionDialog description={description} onResult={vi.fn()} />
          <IDialogOutlet />
        </IDialogProvider>
      );
      fireEvent.click(screen.getByRole('button', { name: `Open ${kind}` }));
      const body = screen.getByRole('dialog').querySelector('p')!;
      expect(body.querySelector('strong')?.textContent).toBe('Name');
      expect(body.querySelector('br')).not.toBeNull();
      expect(body.querySelectorAll('b, em, i')).toHaveLength(3);
      expect(
        body.querySelector('script, img, svg, iframe, a, input')
      ).toBeNull();
      expect(
        Array.from(body.querySelectorAll('*')).every(
          (node) => node.attributes.length === 0
        )
      ).toBe(true);
      expect(body.textContent).toContain("<b>Literal</b> & O'Brien");
    });
  }

  it('retains confirm, cancel and required Reason results', async () => {
    const onResult = vi.fn();
    const view = render(
      <IDialogProvider>
        <OpenDescriptionDialog
          description="<b>Continue?</b>"
          reason
          onResult={onResult}
        />
        <IDialogOutlet />
      </IDialogProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open Confirm' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    expect(onResult).not.toHaveBeenCalled();
    fireEvent.change(screen.getByRole('textbox'), {
      target: { value: 'Approved reason' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    await waitFor(() =>
      expect(onResult).toHaveBeenCalledWith('Approved reason')
    );
    view.rerender(
      <IDialogProvider>
        <OpenDescriptionDialog description="Continue?" onResult={onResult} />
        <IDialogOutlet />
      </IDialogProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open Confirm' }));
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(onResult).toHaveBeenLastCalledWith(undefined));
    fireEvent.click(screen.getByRole('button', { name: 'Open Confirm' }));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    await waitFor(() => expect(onResult).toHaveBeenLastCalledWith(true));
  });
});

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
        <IDialog title="Controlled dialog" actions={[]}>
          Content
        </IDialog>
      </IDialogContainer>
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    expect(container.querySelector('.i-dialog-panel')).toHaveStyle({
      width: '380px',
    });
    fireEvent.click(container.querySelector('.i-dialog-backdrop')!);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
    expect(screen.getByText('Content')).toBeTruthy();
    rerender(
      <IDialogContainer config={{ disableClose: true }} onClose={onClose}>
        Content
      </IDialogContainer>
    );
    fireEvent.click(container.querySelector('.i-dialog-backdrop')!);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
    rerender(
      <IDialogContainer config={{ backdropClose: false }} onClose={onClose}>
        Content
      </IDialogContainer>
    );
    fireEvent.click(container.querySelector('.i-dialog-backdrop')!);
    expect(onClose).toHaveBeenCalledTimes(2);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(3);
    rerender(
      <IDialogContainer isTopMost={false} onClose={onClose}>
        Content
      </IDialogContainer>
    );
    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.click(container.querySelector('.i-dialog-backdrop')!);
    expect(onClose).toHaveBeenCalledTimes(3);
  });
});

function ServiceContent() {
  const data = useIDialogData<{ title: string }>();
  const ref = useIDialogRef<string>();
  return (
    <IDialog
      title={data.title}
      actions={['ok']}
      onOk={() => ref.close('confirmed')}
    />
  );
}
function OpenServiceDialog({
  onResult,
}: {
  onResult: (value?: string) => void;
}) {
  const dialog = useIDialog();
  return (
    <button
      onClick={() => {
        dialog
          .open<
            { title: string },
            string
          >(ServiceContent, { data: { title: 'Service dialog' } })
          .subscribe(onResult);
      }}>
      Open
    </button>
  );
}

describe('service dialog compatibility', () => {
  it('injects instance data and ref, then removes the closed dialog', () => {
    const onResult = vi.fn();
    render(
      <IDialogProvider>
        <OpenServiceDialog onResult={onResult} />
        <IDialogOutlet />
      </IDialogProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByText('Service dialog')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(onResult).toHaveBeenCalledWith('confirmed');
    expect(screen.queryByRole('dialog')).toBeNull();
  });
});
