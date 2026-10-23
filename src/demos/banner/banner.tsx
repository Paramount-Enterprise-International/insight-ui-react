import { useState } from 'react';
import { IBanner, IButton, type IBannerVariant } from '../../components';
export function BannerDemo() {
  const variants: IBannerVariant[] = [
    'neutral',
    'primary',
    'success',
    'info',
    'warning',
    'danger',
  ];
  const [open, setOpen] = useState(true);
  const [count, setCount] = useState(0);
  const [closed, setClosed] = useState(0);
  return (
    <div className="flex flex-col gap-lg p-lg">
      <h1>Banner</h1>
      <p>
        Neutral is unaccented. Primary follows the theme accent. Info follows
        the informational color. The default variant is info.
      </p>
      {variants.map((variant) => (
        <IBanner
          key={variant}
          variant={variant}
          prefixIcon="info"
          message={variant + ' message'}
        />
      ))}
      <IBanner
        closable
        prefixIcon="info"
        suffixIcon="sync"
        onClose={() => setClosed(closed + 1)}>
        <strong>Children-only content.</strong>
        <p>Rich HTML and interactive components are supported.</p>
        <IButton size="xs" onClick={() => setCount(count + 1)}>
          Action {count}
        </IButton>
      </IBanner>
      <p>Close interactions: {closed}</p>
      <IBanner
        closable
        message="Controlled visibility"
        open={open}
        onOpenChange={setOpen}
      />
      <IButton onClick={() => setOpen(true)}>Open Controlled Banner</IButton>
      <IBanner message="Text-only message" />
      <IBanner />
    </div>
  );
}
