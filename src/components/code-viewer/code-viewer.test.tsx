import { cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, vi } from 'vitest';
import { ICodeViewer } from './code-viewer';

describe('ICodeViewer', () => {
  afterEach(() => {
    cleanup();
    document.querySelectorAll('base').forEach((base) => base.remove());
    vi.restoreAllMocks();
  });

  it('renders host', () => {
    const { container } = render(
      <ICodeViewer
        code="const x = 1;"
        language="typescript"
        highlighter="none"
      />
    );

    expect(container.querySelector('i-code-viewer')).toBeTruthy();
  });

  it('loads a file relative to the document base', async () => {
    const base = document.createElement('base');
    base.href = '/-/';
    document.head.append(base);

    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('const value = 1;'));

    render(
      <ICodeViewer
        file="/docs/dialog/service.tsx"
        highlighter="none"
      />
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        `${window.location.origin}/-/docs/dialog/service.tsx`,
        { method: 'GET' }
      );
    });
  });

  it('loads a file from the origin when the document has no base', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('const value = 1;'));

    render(
      <ICodeViewer
        file="/docs/dialog/service.tsx"
        highlighter="none"
      />
    );

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        `${window.location.origin}/docs/dialog/service.tsx`,
        { method: 'GET' }
      );
    });
  });

  it('preserves an external file URL', async () => {
    const file = 'https://example.com/docs/dialog/service.tsx';
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(new Response('const value = 1;'));

    render(<ICodeViewer file={file} highlighter="none" />);

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(file, { method: 'GET' });
    });
  });
});
