import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ILoadingRegion } from './loading-region';
describe('ILoadingRegion', () => {
  it('shares its initial height token with empty content and forwards overrides', () => {
    const { container, rerender } = render(
      <ILoadingRegion loading>
        <span>Pending</span>
      </ILoadingRegion>
    );
    const host = container.querySelector('i-loading-region') as HTMLElement;
    const region = container.querySelector(
      '[data-i-loading-container]'
    ) as HTMLElement;
    expect(host.style.getPropertyValue('--i-region-state-min-height')).toBe(
      'var(--i-state-min-height, min(40vh, 240px))'
    );
    expect(region.style.minHeight).toBe(
      'var(--i-state-min-height, min(40vh, 240px))'
    );
    rerender(
      <ILoadingRegion loading initialMinHeight="180px">
        <span>Pending</span>
      </ILoadingRegion>
    );
    expect(host.style.getPropertyValue('--i-region-state-min-height')).toBe(
      '180px'
    );
    expect(region.style.minHeight).toBe('180px');
  });

  it('preserves content identity, unsaved values and interaction state', () => {
    const { container, rerender } = render(
      <ILoadingRegion>
        <input defaultValue="Original" />
      </ILoadingRegion>
    );
    const input = container.querySelector('input')!;
    fireEvent.change(input, { target: { value: 'Unsaved' } });
    rerender(
      <ILoadingRegion loading>
        <input defaultValue="Original" />
      </ILoadingRegion>
    );
    expect(container.querySelector('input')).toBe(input);
    expect(input.value).toBe('Unsaved');
    expect(container.querySelector('[inert]')).not.toBeNull();
    expect(container.querySelector('i-loading')).not.toBeNull();
    rerender(
      <ILoadingRegion>
        <input defaultValue="Original" />
      </ILoadingRegion>
    );
    expect(container.querySelector('[inert]')).toBeNull();
  });
  it('supports initial render state and hides previous contexts', () => {
    const { container, rerender } = render(
      <ILoadingRegion loading>
        {({ hasLoaded }) => (hasLoaded ? <input /> : null)}
      </ILoadingRegion>
    );
    expect(container.querySelector('input')).toBeNull();
    rerender(
      <ILoadingRegion contextKey="one">
        <input aria-label="Name" />
      </ILoadingRegion>
    );
    expect(screen.getByLabelText('Name')).not.toBeNull();
    rerender(
      <ILoadingRegion contextKey="two" loading>
        <input aria-label="Name" />
      </ILoadingRegion>
    );
    expect(
      (container.querySelector('[data-i-loading-content]') as HTMLElement).style
        .visibility
    ).toBe('hidden');
  });
});
