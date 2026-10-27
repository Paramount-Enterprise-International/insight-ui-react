import { useEffect, useRef, useState } from 'react';
import {
  IButton,
  ISnackbar,
  ISnackbarProvider,
  useISnackbar,
  type IBannerVariant,
  type ISnackbarPosition,
} from '../../components';

function SnackbarControls({
  setLimit,
}: {
  setLimit: (limit?: number) => void;
}) {
  const snackbar = useISnackbar();
  const ids = useRef(new Set<string>());
  const [open, setOpen] = useState(false);
  const positions: ISnackbarPosition[] = [
    'top-left',
    'top-center',
    'top-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ];
  const variants: IBannerVariant[] = [
    'neutral',
    'primary',
    'success',
    'info',
    'warning',
    'danger',
  ];
  useEffect(
    () => () => {
      for (const id of ids.current) snackbar.dismiss(id);
    },
    [snackbar]
  );
  return (
    <>
      <h2>Snackbar</h2>
      <p>
        Messages stack vertically. Hover or focus pauses the timer. Matching IDs
        update one message.
      </p>
      <div className="flex flex-wrap gap-sm">
        {positions.map((position) => (
          <IButton
            key={position}
            onClick={() => {
              ids.current.add(
                snackbar.show(position + ' snackbar', {
                  position,
                  actionLabel: 'Done',
                }).id
              );
            }}>
            {position}
          </IButton>
        ))}
      </div>
      <div className="flex flex-wrap gap-sm">
        {variants.map((variant) => (
          <IButton
            key={variant}
            onClick={() => {
              ids.current.add(
                snackbar.show(variant + ' snackbar', { variant }).id
              );
            }}>
            {variant}
          </IButton>
        ))}
      </div>
      <div className="flex flex-wrap gap-sm">
        <IButton onClick={() => setLimit(undefined)}>Unlimited Stack</IButton>
        <IButton onClick={() => setLimit(2)}>Limit to Two per Position</IButton>
        <IButton
          onClick={() => {
            const id = 'snackbar-demo-fixed';
            ids.current.add(id);
            snackbar.show('This message stays until dismissed.', {
              id,
              title: 'Persistent snackbar',
              durationMs: 0,
            });
          }}>
          Show Persistent Message
        </IButton>
        <IButton
          onClick={() =>
            snackbar.update('snackbar-demo-fixed', {
              message: 'Updated using the same ID.',
              variant: 'info',
              durationMs: 5000,
            })
          }>
          Update by ID
        </IButton>
        <IButton onClick={() => snackbar.dismiss('snackbar-demo-fixed')}>
          Dismiss by ID
        </IButton>
        <IButton onClick={() => setOpen(true)}>
          Open Controlled Snackbar
        </IButton>
      </div>
      <ISnackbar
        message="Controlled snackbar"
        position="bottom-left"
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}

export function SnackbarDemo() {
  const [limit, setLimit] = useState<number>();
  return (
    <ISnackbarProvider maxVisible={limit}>
      <SnackbarControls setLimit={setLimit} />
    </ISnackbarProvider>
  );
}
