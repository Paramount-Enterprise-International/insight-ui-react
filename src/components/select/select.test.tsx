import { act, fireEvent, render } from '@testing-library/react';
import { IFCSelect, ISelect } from './select';

function mockRect(rect: Partial<DOMRect>): DOMRect {
  return {
    bottom: rect.bottom ?? 0,
    height: rect.height ?? 0,
    left: rect.left ?? 0,
    right: rect.right ?? 0,
    top: rect.top ?? 0,
    width: rect.width ?? 0,
    x: rect.x ?? rect.left ?? 0,
    y: rect.y ?? rect.top ?? 0,
    toJSON: () => ({}),
  } as DOMRect;
}

async function flushPositioning() {
  await act(async () => {
    await new Promise((resolve) => window.setTimeout(resolve, 10));
  });
}

describe('IFCSelect', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', {
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      configurable: true,
      value: 768,
    });

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) =>
      window.setTimeout(() => cb(performance.now()), 0)
    );
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) =>
      window.clearTimeout(id)
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders host and inner select', () => {
    const { container } = render(
      <IFCSelect
        label="Pick"
        options={['A', 'B']}
        value={null}
        onChange={() => {}}
        portalToBody={false}
      />
    );

    expect(container.querySelector('i-fc-select')).toBeTruthy();
    expect(container.querySelector('i-select')).toBeTruthy();
  });

  it('opens a content-sized portaled panel with very long option text', async () => {
    const { container } = render(<ISelect options={['A'.repeat(500), 'B']} />);

    const host = container.querySelector('i-select') as HTMLElement;
    const input = container.querySelector('i-input') as HTMLElement;

    vi.spyOn(input, 'getBoundingClientRect').mockReturnValue(
      mockRect({
        bottom: 52,
        height: 32,
        left: 12,
        right: 232,
        top: 20,
        width: 220,
        x: 12,
        y: 20,
      })
    );

    fireEvent.keyDown(host, { key: 'ArrowDown' });

    const panel = document.body.querySelector('i-options') as HTMLElement;
    expect(panel).toBeTruthy();

    vi.spyOn(panel, 'getBoundingClientRect').mockReturnValue(
      mockRect({
        bottom: 172,
        height: 120,
        left: 12,
        right: 232,
        top: 52,
        width: 220,
        x: 12,
        y: 52,
      })
    );

    await flushPositioning();

    expect(panel.classList.contains('i-options--portaled')).toBe(true);
    expect(panel.style.position).toBe('fixed');
    expect(panel.style.width).toBe('max-content');
    expect(panel.style.minWidth).toBe('220px');
    expect(panel.style.overflowX).toBe('clip');
    expect(panel.style.overflowY).toBe('auto');
    expect(Number.parseFloat(panel.style.maxWidth)).toBeLessThanOrEqual(
      window.innerWidth - 16
    );
  });

  it('keeps exact trigger width when matchTriggerWidth is enabled', async () => {
    const { container } = render(
      <ISelect matchTriggerWidth options={['A'.repeat(500), 'B']} />
    );

    const host = container.querySelector('i-select') as HTMLElement;
    const input = container.querySelector('i-input') as HTMLElement;

    vi.spyOn(input, 'getBoundingClientRect').mockReturnValue(
      mockRect({
        bottom: 52,
        height: 32,
        left: 12,
        right: 232,
        top: 20,
        width: 220,
        x: 12,
        y: 20,
      })
    );

    fireEvent.keyDown(host, { key: 'ArrowDown' });

    const panel = document.body.querySelector('i-options') as HTMLElement;
    expect(panel).toBeTruthy();

    vi.spyOn(panel, 'getBoundingClientRect').mockReturnValue(
      mockRect({
        bottom: 172,
        height: 120,
        left: 12,
        right: 232,
        top: 52,
        width: 220,
        x: 12,
        y: 52,
      })
    );

    await flushPositioning();

    expect(panel.style.width).toBe('220px');
    expect(panel.style.minWidth).toBe('220px');
    expect(panel.style.overflowX).toBe('clip');
    expect(panel.style.overflowY).toBe('auto');
  });
});
